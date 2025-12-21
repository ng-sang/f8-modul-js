import { API_BASE_URL } from './config.js';

const STORAGE_KEY = 'yt_music_player_state';
const AUTH_KEY = 'yt_auth_token';
const USER_KEY = 'yt_auth_user';

let currentPlaylist = [], currentTrackIndex = 0, lastVolume = 1;

const audio = document.getElementById("main-audio");
const els = {
    bar: document.getElementById("player-bar"),
    play: document.getElementById("btn-play"),
    prev: document.getElementById("btn-prev"),
    next: document.getElementById("btn-next"),
    iconPlay: document.getElementById("icon-play"),
    iconPause: document.getElementById("icon-pause"),
    progress: document.getElementById("progress-bar"),
    cont: document.getElementById("progress-container"),
    title: document.getElementById("player-title"),
    artist: document.getElementById("player-artist"),
    img: document.getElementById("player-img"),
    curTime: document.getElementById("current-time"),
    durTime: document.getElementById("total-duration"),
    slider: document.getElementById("volume-slider"),
    btnVol: document.getElementById("btn-volume"),
    volOn: document.getElementById("icon-vol-on"),
    volMute: document.getElementById("icon-vol-mute"),
    close: document.getElementById("btn-close-player")
};

const fmtTime = s => s ? `${Math.floor(s / 60)}:${(Math.floor(s % 60) + '').padStart(2, '0')}` : '0:00';
const fmtDur = s => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h} giờ ${m} phút` : `${m} phút`; };

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ playlist: currentPlaylist, index: currentTrackIndex, currentTime: audio.currentTime, volume: audio.volume }));
}

function loadState() {
    try {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!state) return;
        audio.volume = els.slider.value = state.volume ?? 1;
        updateVolIcon(audio.volume);
        if (state.playlist?.length) {
            currentPlaylist = state.playlist;
            currentTrackIndex = state.index || 0;
            els.bar.classList.remove("hidden"); els.bar.classList.add("flex");
            renderPlayerUI(currentPlaylist[currentTrackIndex]);
            if (currentPlaylist[currentTrackIndex].audioUrl) {
                audio.src = currentPlaylist[currentTrackIndex].audioUrl;
                audio.currentTime = state.currentTime || 0;
            }
            highlightTrack(currentTrackIndex);
        }
        updatePlayBtn(false);
    } catch (e) {}
}

// --- LOGIC RENDER CHI TIẾT ---

// 1. Playlist & Album (Giao diện 2 cột)
async function fetchAndRenderList(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const res = await fetch(url);
        const data = await res.json();
        window.viewingPlaylist = data.tracks || [];
        const cover = data.thumbnails?.[0] || 'https://picsum.photos/400';
        
        container.innerHTML = `
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 pt-6 pb-20">
            <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center text-center md:sticky md:top-4 h-fit">
                <div class="w-[280px] md:w-full aspect-square rounded-lg overflow-hidden shadow-2xl mb-6"><img src="${cover}" class="w-full h-full object-cover"></div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">${data.title}</h1>
                <div class="text-[#aaaaaa] text-[15px] font-medium space-y-1">
                    <p>${data.albumType || 'Playlist'} • ${Array.isArray(data.artists) ? data.artists.map(a => a.name).join(', ') : 'Various'}</p>
                    <p>${window.viewingPlaylist.length} bài • ${fmtDur(data.duration || 0)}</p>
                </div>
                <p class="text-gray-500 text-sm mt-4 line-clamp-3">${data.description || ''}</p>
                <div class="flex gap-3 mt-6"><button onclick="window.playMusic(0, true)" class="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200">Phát tất cả</button></div>
            </div>
            <div class="flex-grow w-full min-w-0">
                <ul class="flex flex-col">
                    ${window.viewingPlaylist.map((t, i) => `
                    <li id="track-${i}" onclick="window.playMusic(${i}, true)" class="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer border-b border-transparent mb-1 transition">
                        <span class="w-8 text-center text-gray-400 font-medium text-sm group-hover:hidden">${i + 1}</span>
                        <span class="w-8 text-center hidden group-hover:block"><svg class="w-5 h-5 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
                        <div class="w-10 h-10 rounded overflow-hidden mr-4 shrink-0"><img src="${t.thumbnails?.[0] || 'https://picsum.photos/50'}" class="w-full h-full object-cover"></div>
                        <div class="flex flex-col flex-grow overflow-hidden mr-4"><span class="text-[15px] font-medium text-white truncate group-hover:underline">${t.title}</span><span class="text-xs text-gray-400 truncate">${t.artists?.map(a => a.name || a).join(', ') || ''}</span></div>
                        <span class="text-sm text-gray-400 font-mono">${fmtTime(t.duration || 0)}</span>
                    </li>`).join('')}
                </ul>
            </div>
        </div>`;
        highlightTrack(currentTrackIndex);
    } catch (e) { console.error(e); }
}

export const mods = (id) => fetchAndRenderList(`${API_BASE_URL}/playlists/details/${id}`, 'playlist-container');
export const loadAlbumDetails = (slug) => fetchAndRenderList(`${API_BASE_URL}/albums/details/${slug}`, 'album-container');

// 2. Categories (Tâm trạng - Nhiều slider ngang)
export async function loadCategoryDetails(slug) {
    const container = document.getElementById('category-container');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE_URL}/categories/${slug}`);
        const data = await res.json();
        const subcats = data.subcategories || [];
        if (!subcats.length) { container.innerHTML = '<div class="text-gray-500 pt-10 text-center">Không có nội dung.</div>'; return; }

        container.innerHTML = `<div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">${subcats.map((sub, idx) => `
            <div class="w-full mb-10 group/section">
                <div class="flex items-center justify-between mb-4"><h2 class="text-3xl font-bold text-white">${sub.name}</h2>
                    <div class="flex gap-2"><button id="btn-p-c-${idx}" class="hidden w-8 h-8 rounded-full bg-transparent border border-white/10 hover:bg-white/10 items-center justify-center transition"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><button id="btn-n-c-${idx}" class="w-8 h-8 rounded-full bg-transparent border border-white/10 hover:bg-white/10 flex items-center justify-center transition"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div>
                </div>
                <div id="sc-c-${idx}" class="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar w-full pb-4">
                    ${(sub.playlists || []).map(p => `
                        <a href="/playlists/details/${p.slug}" class="w-[200px] shrink-0 cursor-pointer group flex flex-col">
                            <div class="relative w-full aspect-square rounded-md overflow-hidden mb-3"><img src="${p.thumbnailUrl || 'https://picsum.photos/200'}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy"><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><button class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-lg"><svg class="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></div></div>
                            <h3 class="text-white font-bold text-[16px] truncate hover:underline">${p.name || p.title}</h3><p class="text-[#909090] text-[14px] truncate mt-1">${p.description || 'Playlist'}</p>
                        </a>`).join('')}
                </div>
            </div>`).join('')}</div>`;

        subcats.forEach((_, idx) => {
            const row = document.getElementById(`sc-c-${idx}`), bP = document.getElementById(`btn-p-c-${idx}`), bN = document.getElementById(`btn-n-c-${idx}`);
            if(row && bP && bN) {
                row.onscroll = () => bP.classList.toggle('hidden', row.scrollLeft <= 20) || bP.classList.toggle('flex', row.scrollLeft > 20);
                bN.onclick = () => row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' });
                bP.onclick = () => row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' });
            }
        });
    } catch (e) { container.innerHTML = `<div class="text-red-500 text-center mt-10">Lỗi tải dữ liệu.</div>`; }
}

// 3. Lines (Thể loại - Grid bài hát)
export async function loadLineDetails(slug) {
    const container = document.getElementById('line-container');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE_URL}/lines/${slug}/songs`);
        const data = await res.json();
        const items = data.items || [];
        window.viewingPlaylist = items;

        container.innerHTML = `
            <div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">
                <h1 class="text-3xl font-bold text-white mb-8 capitalize">Bài hát</h1>
                ${!items.length ? '<p class="text-gray-500">Chưa có bài hát.</p>' : ''}
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${items.map((item, index) => `
                        <div onclick="window.playMusic(${index}, true)" class="group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition select-none">
                            <div class="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                                <img src="${item.thumb || 'https://picsum.photos/100'}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                            </div>
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="text-white font-bold text-[15px] truncate group-hover:underline" title="${item.name}">${item.name}</h3>
                                <p class="text-[#909090] text-[13px] truncate mt-0.5">${item.views ? item.views.toLocaleString() + ' lượt xem' : ''}</p>
                                <p class="text-[#909090] text-[13px] truncate mt-0.5">${item.albumName || ''}</p>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`;
    } catch (e) { container.innerHTML = `<div class="text-red-500 text-center mt-10">Lỗi tải dữ liệu.</div>`; }
}

// --- PLAYER CORE ---
window.playMusic = async (index, newCtx = false) => {
    if (newCtx && window.viewingPlaylist?.length) currentPlaylist = [...window.viewingPlaylist];
    if (!currentPlaylist[index]) return;

    currentTrackIndex = index;
    const track = currentPlaylist[index];

    els.bar.classList.add("flex"); els.bar.classList.remove("hidden");
    renderPlayerUI(track); highlightTrack(index); updatePlayBtn(true);

    if (track.audioUrl) {
        audio.src = track.audioUrl;
        try { await audio.play(); saveState(); } catch (e) { if(e.name!=="AbortError") updatePlayBtn(false); }
    } else { alert("Chưa có link Audio!"); updatePlayBtn(false); }
};

function renderPlayerUI(t) {
    els.title.innerText = t.title || t.name || "Unknown";
    els.img.src = (t.thumbnails && t.thumbnails[0]) ? t.thumbnails[0] : (t.thumb || 'https://picsum.photos/50');
    els.artist.innerText = Array.isArray(t.artists) ? t.artists.map(a => a.name || a).join(', ') : (t.albumName || 'Unknown');
}

function highlightTrack(i) {
    document.querySelectorAll('li[id^="track-"]').forEach(li => li.classList.remove("bg-white/10"));
    document.getElementById(`track-${i}`)?.classList.add("bg-white/10");
}

function updatePlayBtn(isPlaying) {
    els.iconPlay.classList.toggle("hidden", isPlaying);
    els.iconPause.classList.toggle("hidden", !isPlaying);
}

function updateVolIcon(vol) {
    els.volOn.classList.toggle("hidden", vol === 0);
    els.volMute.classList.toggle("hidden", vol > 0);
    els.btnVol.classList.toggle("text-red-500", vol === 0);
}

els.play.onclick = () => { audio.paused ? (audio.play(), updatePlayBtn(true)) : (audio.pause(), updatePlayBtn(false)); saveState(); };
els.next.onclick = () => window.playMusic(currentTrackIndex + 1 >= currentPlaylist.length ? 0 : currentTrackIndex + 1);
els.prev.onclick = () => window.playMusic(currentTrackIndex - 1 < 0 ? currentPlaylist.length - 1 : currentTrackIndex - 1);
els.btnVol.onclick = () => { audio.volume = audio.volume > 0 ? (lastVolume = audio.volume, els.slider.value = 0, 0) : (els.slider.value = lastVolume, lastVolume); updateVolIcon(audio.volume); saveState(); };
els.slider.oninput = (e) => { audio.volume = +e.target.value; updateVolIcon(audio.volume); if(audio.volume > 0) lastVolume = audio.volume; saveState(); };
els.cont.onclick = (e) => { if(audio.duration) audio.currentTime = (e.offsetX / els.cont.clientWidth) * audio.duration; saveState(); };
els.close.onclick = () => { audio.pause(); updatePlayBtn(false); els.bar.classList.add("hidden"); els.bar.classList.remove("flex"); currentPlaylist = []; saveState(); };
audio.ontimeupdate = () => { if(!audio.duration) return; els.progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`; els.curTime.innerText = fmtTime(audio.currentTime); els.durTime.innerText = fmtTime(audio.duration); };
audio.onended = () => els.next.click();
window.onbeforeunload = saveState;

// --- AUTH ---
const authRequest = async (endpoint, body) => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem(AUTH_KEY, data.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        return { success: true, user: data.user };
    } catch (e) { return { success: false, message: e.message }; }
};
export const login = (email, password) => authRequest('login', { email, password });
export const register = (name, email, password, confirmPassword) => authRequest('register', { name, email, password, confirmPassword });
export const logout = () => { localStorage.removeItem(AUTH_KEY); localStorage.removeItem(USER_KEY); window.dispatchEvent(new Event('auth-change')); window.location.hash = '/'; };
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || 'null');

loadState();