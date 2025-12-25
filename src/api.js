import { API_BASE_URL } from './config.js';
const STORAGE_KEY = 'yt_music_player_state';
const AUTH_KEY = 'yt_auth_token';
const REFRESH_KEY = 'yt_refresh_token';
const USER_KEY = 'yt_auth_user';


// --- 1. BIẾN TRẠNG THÁI & DOM ELEMENTS ---
// ============================================================
let currentPlaylist = [];
let currentTrackIndex = 0;
let lastVolume = 1;
let activePlayerType = 'audio'; // 'audio' | 'video'
let ytPlayer = null;
let videoProgressInterval = null;

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
    close: document.getElementById("btn-close-player"),
    infoArea: document.querySelector("#player-bar > div > div:nth-child(2)") 
};


// --- 2. HELPERS & UTILS ---
// ============================================================

// Load Youtube API
if (!document.getElementById('yt-api-script')) {
    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

const fmtTime = s => s ? `${Math.floor(s / 60)}:${(Math.floor(s % 60) + '').padStart(2, '0')}` : '0:00';
const fmtDur = s => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h} giờ ${m} phút` : `${m} phút`; };

// Hàm chuẩn hóa item để đảm bảo luôn có ID và Thumbnails
const normalizeItem = (item) => {
    return {
        ...item,
        //  id phải là ID nội bộ 
        id: item.encodeId || item.id, 
        // videoId riêng để player YouTube dùng
        videoId: item.videoId || (item.id && item.id.length < 15 ? item.id : null), 
        thumbnails: item.thumbnails || (item.thumb ? [item.thumb] : [])
    };
};

function highlightTrack(i) {
    document.querySelectorAll('[id^="track-"]').forEach(li => li.classList.remove("bg-white/10", "bg-white/20"));
    const activeEl = document.getElementById(`track-${i}`);
    if (activeEl) {
        activeEl.classList.add("bg-white/20");
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ============================================================
// --- 3. AUTHENTICATION (SECURE FETCH) ---
// ============================================================

function getAccessToken() { return sessionStorage.getItem(AUTH_KEY); }

async function refreshToken() {
    const rToken = sessionStorage.getItem(REFRESH_KEY);
    if (!rToken) return false;
    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rToken })
        });
        const data = await res.json();
        if (res.ok && data.access_token) {
            sessionStorage.setItem(AUTH_KEY, data.access_token);
            if (data.refresh_token) sessionStorage.setItem(REFRESH_KEY, data.refresh_token);
            return true;
        }
    } catch (e) { console.error("Refresh token error", e); }
    return false;
}

// Hàm Fetch tự động Refresh Token
async function authFetch(endpoint, options = {}) {
    let token = getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    const config = { ...options, headers };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
            config.headers['Authorization'] = `Bearer ${getAccessToken()}`;
            response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
            logout();
            throw new Error("Phiên đăng nhập hết hạn");
        }
    }
    return response;
}

// Helper cho Login/Register (Không cần token)
const authRequest = async (endpoint, body, method = 'POST') => { 
    try { 
        const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) }); 
        const data = await res.json(); 
        if (!res.ok) return { success: false, message: data.message }; 
        
        sessionStorage.setItem(AUTH_KEY, data.access_token); 
        sessionStorage.setItem(REFRESH_KEY, data.refresh_token); 
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user)); 
        
        window.dispatchEvent(new Event('auth-change')); 
        return { success: true, user: data.user }; 
    } catch (e) { return { success: false, message: e.message }; } 
};

// --- EXPORT AUTH FUNCTIONS ---
export const login = (e, p) => authRequest('login', { email: e, password: p });
export const register = (n, e, p, cp) => authRequest('register', { name: n, email: e, password: p, confirmPassword: cp });

// Cập nhật thông tin (PATCH)
export const updateProfile = async (name, email) => {
    try {
        const res = await authFetch('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify({ name, email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const currentUser = getUser();
        if (currentUser) {
            currentUser.name = name;
            currentUser.email = email;
            sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser));
            window.dispatchEvent(new Event('auth-change'));
        }
        return { success: true, message: data.message };
    } catch (e) { return { success: false, message: e.message }; }
};

// Đổi mật khẩu (PATCH) - Map đúng key API yêu cầu
export const changePassword = async (oldPassword, password, confirmPassword) => {
    try {
        const res = await authFetch('/auth/change-password', {
            method: 'PATCH',
            body: JSON.stringify({ oldPassword, password, confirmPassword })
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.message };
        return { success: true, message: "Đổi mật khẩu thành công!" };
    } catch (e) { return { success: false, message: e.message }; }
};

export const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
    window.location.hash = '/';
};

export const getUser = () => JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');


// ============================================================
// --- 4. STORAGE & LOAD STATE ---
// ============================================================
function saveState() {
    let currentTime = audio.currentTime;
    if (activePlayerType === 'video' && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        try { currentTime = ytPlayer.getCurrentTime(); } catch(e){}
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        playlist: currentPlaylist, 
        index: currentTrackIndex, 
        currentTime: currentTime, 
        volume: lastVolume, 
        activePlayerType: activePlayerType 
    }));
}

export function loadState() {
    try {
        const state = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        if (!state) return;
        
        if (state.volume) { lastVolume = state.volume; audio.volume = lastVolume; els.slider.value = lastVolume; updateVolIcon(lastVolume); }
        
        if (state.playlist?.length) {
            currentPlaylist = state.playlist;
            currentTrackIndex = state.index || 0;
            activePlayerType = state.activePlayerType || 'audio';

            els.bar.classList.remove("hidden"); els.bar.classList.add("flex");
            renderPlayerUI(currentPlaylist[currentTrackIndex]);
            highlightTrack(currentTrackIndex);

            const isVideoPage = document.getElementById('video-container');

            if (activePlayerType === 'audio') {
                if (currentPlaylist[currentTrackIndex].audioUrl) {
                    audio.src = currentPlaylist[currentTrackIndex].audioUrl;
                    audio.currentTime = state.currentTime || 0;
                }
                destroyYouTubePlayer();
            } else if (activePlayerType === 'video') {
                audio.pause();
                // Nếu không ở trang video thì bật mini player
                const track = currentPlaylist[currentTrackIndex];
                const vId = track.videoId || track.id;
                if (!isVideoPage && vId) initYouTubePlayer(vId, state.currentTime || 0);
            }
            updatePlayBtn(false); 
        }
    } catch (e) {}
}


// ============================================================
// --- 5. RENDER VIEWS (Chi tiết các trang) ---
// ============================================================

// Playlist & Album
async function fetchAndRenderList(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const res = await fetch(url);
        const data = await res.json();
        // Normalize
        window.viewingPlaylist = (data.tracks || []).map(normalizeItem);
        const cover = data.thumbnails?.[0] || 'https://picsum.photos/400';
        
        container.innerHTML = `
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 pt-6 pb-20">
            <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center text-center md:sticky md:top-4 h-fit">
                <div class="w-[280px] md:w-full aspect-square rounded-lg overflow-hidden shadow-2xl mb-6"><img src="${cover}" class="w-full h-full object-cover"></div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">${data.title}</h1>
                <div class="text-[#aaaaaa] text-[15px] font-medium space-y-1">
                    <p>${data.albumType || 'Playlist'}</p>
                    <p>${window.viewingPlaylist.length} bài • ${fmtDur(data.duration || 0)}</p>
                </div>
                <div class="flex gap-3 mt-6"><button onclick="window.playMusic(0, true)" class="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">Phát tất cả</button></div>
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
    } catch (e) { console.error(e); }
}
export const mods = (id) => fetchAndRenderList(`${API_BASE_URL}/playlists/details/${id}`, 'playlist-container');
export const loadAlbumDetails = (slug) => fetchAndRenderList(`${API_BASE_URL}/albums/details/${slug}`, 'album-container');


// Song Details
export async function loadSongDetails(id) {
    const container = document.getElementById('song-detail-container');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE_URL}/songs/details/${id}`);
        const data = await res.json();
        
        // Logic gộp tracks và related
        const items = [...(data.album?.tracks || []), ...(data.related || [])].map(normalizeItem);
        window.viewingPlaylist = items;

        const cover = data.thumbnail || (Array.isArray(data.thumbnails) ? (data.thumbnails[0]?.url || data.thumbnails[0]) : data.thumbnails) || data.album?.thumbnail || 'https://picsum.photos/400';

        container.innerHTML = `
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 pt-6 pb-20">
            <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center text-center md:sticky md:top-4 h-fit">
                <div class="w-[280px] md:w-full aspect-square rounded-lg overflow-hidden shadow-2xl mb-6"><img src="${cover}" class="w-full h-full object-cover"></div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">${data.title}</h1>
                <div class="text-[#aaaaaa] text-[15px] font-medium space-y-1"><p>Gợi ý: ${items.length} bài</p></div>
                <div class="flex gap-3 mt-6"><button onclick="window.playMusic(0, true)" class="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200">Phát Ngay</button></div>
            </div>
            <div class="flex-grow w-full min-w-0">
                <ul class="flex flex-col">
                    ${items.map((t, i) => {
                        const thumb = (t.thumbnails && t.thumbnails[0]) ? (t.thumbnails[0].url || t.thumbnails[0]) : (t.thumb || cover);
                        return `<li id="track-${i}" onclick="window.playMusic(${i}, true)" class="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer border-b border-transparent mb-1 transition"><span class="w-8 text-center text-gray-400 font-medium text-sm group-hover:hidden">${i + 1}</span><span class="w-8 text-center hidden group-hover:block"><svg class="w-5 h-5 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span><div class="w-10 h-10 rounded overflow-hidden mr-4 shrink-0"><img src="${thumb}" class="w-full h-full object-cover"></div><div class="flex flex-col flex-grow overflow-hidden mr-4"><span class="text-[15px] font-medium text-white truncate group-hover:underline ${t.id===id ? 'text-green-500' : ''}">${t.title}</span><span class="text-xs text-gray-400 truncate">${t.artists?.map(a=>a.name).join(', ') || (t.artist ? t.artist.name : '')}</span></div><span class="text-sm text-gray-400 font-mono">${fmtTime(t.duration || 0)}</span></li>`;
                    }).join('')}
                </ul>
            </div>
        </div>`;
        const idx = items.findIndex(item => item.id === id); if(idx !== -1) highlightTrack(idx);
    } catch (e) { console.error(e); }
}


// Video Details (Updated with Normalize & Destroy Old Player)
export async function loadVideoDetails(id) {
    const container = document.getElementById('video-container');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE_URL}/videos/details/${id}`);
        const data = await res.json();
        
        // Chuẩn hóa Main Video
    const mainVideo = normalizeItem({ 
            id: data.id, // Bắt buộc lấy data.id (ID nội bộ), không lấy videoId
            encodeId: data.id, // Dự phòng
            videoId: data.videoId, // ID Youtube riêng
            title: data.title, 
            thumbnails: [data.thumbnail], 
            artists: Array.isArray(data.artists) ? data.artists : [{name: 'Unknown'}], 
            duration: data.duration, 
            type: 'video' 
        });

        // Chuẩn hóa Related
        const related = (data.related || []).map(r => normalizeItem({ ...r, type: 'video' }));

        currentPlaylist = [mainVideo, ...related];
        currentTrackIndex = 0;
        
        // Check if same video playing to resume time
        let startTime = 0;
        if (activePlayerType === 'video' && ytPlayer && ytPlayer.getVideoData && ytPlayer.getVideoData().video_id === mainVideo.videoId) {
            try { startTime = ytPlayer.getCurrentTime(); } catch(e){}
        }

        activePlayerType = 'video';
        audio.pause(); 
        
        // Hủy player cũ 
        destroyYouTubePlayer();

        container.innerHTML = `
            <div class="max-w-[1400px] mx-auto pt-6 px-4 pb-20 flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-[70%]">
                    <div class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-4">
                        <div id="yt-player-embed" class="w-full h-full"></div>
                    </div>
                    <div class="mb-6"><h1 class="text-2xl md:text-3xl font-bold text-white mb-2">${mainVideo.title}</h1></div>
                </div>
                <div class="w-full lg:w-[30%]">
                    <h2 class="text-xl font-bold text-white mb-4">Danh sách phát liên quan</h2>
                    <div class="flex flex-col gap-2 h-[calc(100vh-150px)] overflow-y-auto no-scrollbar">
                        ${related.map((item, idx) => `
                            <div onclick="window.playMusic(${idx + 1}, false)" class="flex gap-3 p-2 rounded-lg hover:bg-white/10 transition group cursor-pointer" id="track-${idx + 1}">
                                <div class="relative w-32 aspect-video shrink-0 rounded-md overflow-hidden"><img src="${item.thumbnails[0]}" class="w-full h-full object-cover"><div class="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-bold text-white">${fmtTime(item.duration || 0)}</div></div>
                                <div class="flex flex-col justify-center overflow-hidden"><h3 class="text-white font-bold text-sm truncate">${item.title}</h3></div>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`;

        initYouTubePlayer(mainVideo.videoId, startTime);
        els.bar.classList.remove("hidden"); els.bar.classList.add("flex");
        renderPlayerUI(mainVideo); updatePlayBtn(true);
    } catch (e) { 
        console.error(e);
        container.innerHTML = `<div class="text-white text-center p-10"><h1>Không thể tải video</h1><button onclick="history.back()" class="text-blue-500 mt-2 hover:underline">Quay lại</button></div>`;
    }
}


// --- D. RENDER SEARCH RESULTS 
// ============================================================
export async function loadSearchResults(keyword) {
    const container = document.getElementById('search-results');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE_URL}/search?q=${keyword}`);
        const data = await res.json();
        
        // Dữ liệu API trả về thường nằm trong data.data.items
        const items = data.data?.items || data.results || [];

        if (items.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-gray-500">Không tìm thấy kết quả cho "${decodeURIComponent(keyword)}"</div>`;
            return;
        }

        // 1. Phân loại dữ liệu
        const songs = items.filter(i => i.type === 'song');
        const albums = items.filter(i => i.type === 'album');
        const videos = items.filter(i => i.type === 'video');
        const playlists = items.filter(i => i.type === 'playlist');

        // Lưu danh sách bài hát để phát (nếu người dùng click play)
        window.viewingPlaylist = songs;

        // Helper lấy ảnh an toàn
        const getImg = (i) => (i.thumbnails && i.thumbnails[0]) ? (i.thumbnails[0].url || i.thumbnails[0]) : (i.thumb || 'https://picsum.photos/100');

        // Bắt đầu xây dựng HTML
        let htmlContent = `<div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">
            <h1 class="text-3xl font-bold text-white mb-8">Kết quả cho "${decodeURIComponent(keyword)}"</h1>`;

        // --- SECTION BÀI HÁT (List dọc) ---
        if (songs.length > 0) {
            htmlContent += `
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-white mb-4">Bài hát</h2>
                <div class="flex flex-col gap-2">
                    ${songs.map((item) => `
                        <a href="/songs/details/${item.id}" class="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer transition border-b border-transparent select-none">
                            <!-- Ảnh -->
                            <div class="w-12 h-12 rounded overflow-hidden mr-4 shrink-0 relative">
                                <img src="${getImg(item)}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                            <!-- Info -->
                            <div class="flex flex-col flex-grow overflow-hidden">
                                <span class="text-[15px] font-bold text-white truncate group-hover:underline">${item.title || item.name}</span>
                                <span class="text-xs text-gray-400 truncate">
                                    ${Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : (item.artist?.name || 'Unknown')}
                                </span>
                            </div>
                            <!-- Thời gian -->
                            <span class="text-sm text-gray-400 font-mono">${item.duration ? fmtTime(item.duration) : ''}</span>
                        </a>
                    `).join('')}
                </div>
            </div>`;
        }

        // --- SECTION ALBUMS (Slider ngang) ---
        if (albums.length > 0) {
            htmlContent += `
            <div class="mb-10 group/section">
                <div class="flex items-center justify-between mb-4"><h2 class="text-2xl font-bold text-white">Albums</h2></div>
                <div class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
                    ${albums.map(item => `
                        <a href="#/albums/details/${item.slug || item.id}" class="w-[200px] shrink-0 cursor-pointer group flex flex-col">
                            <div class="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#ffffff1a]">
                                <img src="${getImg(item)}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
                            </div>
                            <h3 class="text-white font-bold text-[15px] truncate hover:underline">${item.title || item.name}</h3>
                            <p class="text-[#909090] text-sm truncate mt-1">Album • ${Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : ''}</p>
                        </a>
                    `).join('')}
                </div>
            </div>`;
        }

        // --- SECTION VIDEOS (Slider ngang - Ảnh 16:9) ---
        if (videos.length > 0) {
            htmlContent += `
            <div class="mb-10 group/section">
                <div class="flex items-center justify-between mb-4"><h2 class="text-2xl font-bold text-white">Videos</h2></div>
                <div class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
                    ${videos.map(item => `
                         <a href="#/videos/details/${item.id}" class="w-[300px] shrink-0 cursor-pointer group flex flex-col">
                            <div class="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-[#ffffff1a]">
                                <img src="${getImg(item)}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                                </div>
                            </div>
                            <h3 class="text-white font-bold text-[15px] truncate hover:underline">${item.title || item.name}</h3>
                            <p class="text-[#909090] text-sm truncate mt-1">Video • ${Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : ''}</p>
                        </a>
                    `).join('')}
                </div>
            </div>`;
        }
        
        // --- SECTION PLAYLISTS (Nếu có) ---
        if (playlists.length > 0) {
            htmlContent += `
            <div class="mb-10 group/section">
                <div class="flex items-center justify-between mb-4"><h2 class="text-2xl font-bold text-white">Danh sách phát</h2></div>
                <div class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
                    ${playlists.map(item => `
                        <a href="#/playlists/details/${item.slug || item.id}" class="w-[200px] shrink-0 cursor-pointer group flex flex-col">
                            <div class="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#ffffff1a]">
                                <img src="${getImg(item)}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
                            </div>
                            <h3 class="text-white font-bold text-[15px] truncate hover:underline">${item.title || item.name}</h3>
                            <p class="text-[#909090] text-sm truncate mt-1">Playlist</p>
                        </a>
                    `).join('')}
                </div>
            </div>`;
        }

        htmlContent += `</div>`;
        container.innerHTML = htmlContent;

    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="text-red-500 p-4">Lỗi tìm kiếm.</div>`;
    }
}


// Category & Line (Grid)
async function fetchAndRenderGrid(url, containerId, isCategory) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (isCategory) {
            const subcats = data.subcategories || [];
            container.innerHTML = `<div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">${subcats.map((sub, idx) => `<div class="w-full mb-10 group/section"><div class="flex items-center justify-between mb-4"><h2 class="text-3xl font-bold text-white">${sub.name}</h2><div class="flex gap-2"><button id="btn-p-${idx}" class="hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></button><button id="btn-n-${idx}" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button></div></div><div id="scr-${idx}" class="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-4">${(sub.playlists||[]).map(p => `<a href="#/playlists/details/${p.slug}" class="w-[200px] shrink-0"><img src="${p.thumbnailUrl}" class="rounded-md mb-2"><h3 class="font-bold truncate">${p.name}</h3></a>`).join('')}</div></div>`).join('')}</div>`;
             subcats.forEach((_, idx) => {
                const r = document.getElementById(`scr-${idx}`), bP = document.getElementById(`btn-p-${idx}`), bN = document.getElementById(`btn-n-${idx}`);
                if(r && bP && bN) { r.onscroll = () => bP.classList.toggle('hidden', r.scrollLeft<=0) || bP.classList.toggle('flex', r.scrollLeft>0); bN.onclick = () => r.scrollBy({left:300, behavior:'smooth'}); bP.onclick = () => r.scrollBy({left:-300, behavior:'smooth'}); }
            });
        } else {
            const items = (data.items || []).map(normalizeItem);
            window.viewingPlaylist = items;
            container.innerHTML = `<div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20"><h1 class="text-3xl font-bold text-white mb-8 capitalize">Kết quả / Bài hát</h1><div class="grid grid-cols-2 md:grid-cols-4 gap-4">${items.map((t, i) => `<a href="#/songs/details/${t.id}" class="group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer select-none"><div class="relative w-16 h-16 shrink-0 rounded overflow-hidden"><img src="${t.thumb || (t.thumbnails?.[0]?.url) || 'https://picsum.photos/100'}" class="w-full h-full object-cover"></div><div class="flex flex-col overflow-hidden"><h3 class="font-bold truncate">${t.name || t.title}</h3><p class="text-gray-400 text-sm truncate">${t.artists?.map(a=>a.name).join(', ') || ''}</p></div></a>`).join('')}</div></div>`;
        }
    } catch (e) { console.error(e); }
}
export const loadCategoryDetails = (slug) => fetchAndRenderGrid(`${API_BASE_URL}/categories/${slug}`, 'category-container', true);
export const loadLineDetails = (slug) => fetchAndRenderGrid(`${API_BASE_URL}/lines/${slug}/songs`, 'line-container', false);

// Explore Pages
export async function loadNewReleases() {
    const c = document.getElementById('new-releases-container'); if(!c) return;
    try {
        const res = await fetch(`${API_BASE_URL}/explore/new-releases`);
        const data = await res.json();
        const items = data.items || [];
        c.innerHTML = `<div class="max-w-[1200px] mx-auto pt-6 px-4"><div class="flex justify-between mb-4"><h1 class="text-3xl font-bold text-white">Bản phát hành mới</h1><div class="flex gap-2"><button id="btn-p-nr" class="hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></button><button id="btn-n-nr" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></button></div></div><div id="sl-nr" class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6">${(items||[]).map(i => `<a href="#/albums/details/${i.slug}" class="w-[200px] shrink-0"><img src="${i.thumb}" class="rounded-lg mb-2"><h3 class="font-bold truncate">${i.name}</h3><p class="text-gray-400 text-sm">${i.albumType}</p></a>`).join('')}</div></div>`;
        const sl = document.getElementById('sl-nr'), bP = document.getElementById('btn-p-nr'), bN = document.getElementById('btn-n-nr');
        sl.onscroll = () => bP.classList.toggle('hidden', sl.scrollLeft<=20) || bP.classList.toggle('flex', sl.scrollLeft>20);
        bN.onclick = () => sl.scrollBy({left: sl.clientWidth*0.8, behavior:'smooth'});
        bP.onclick = () => sl.scrollBy({left: -sl.clientWidth*0.8, behavior:'smooth'});
    } catch(e){}
}
export async function loadMoodsAndGenres() {
    const c = document.getElementById('moods-genres-container'); if(!c) return;
    try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        const items = data.items || [];
        c.innerHTML = `
            <div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">
                <div class="flex justify-between mb-4"><h1 class="text-3xl font-bold text-white">Tâm trạng và thể loại</h1><div class="flex gap-2"><button id="btn-p-mg" class="hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></button><button id="btn-n-mg" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></button></div></div>
                <div id="sl-mg" class="grid grid-rows-4 grid-flow-col gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-6">${items.map(i => `<a href="#/${i.type==='line'?'lines':'categories'}/${i.slug}" class="relative flex items-center bg-[#292929] hover:bg-[#3e3e3e] rounded-md h-[60px] w-[200px] md:w-[220px] shrink-0 cursor-pointer overflow-hidden transition select-none group"><div class="absolute left-0 top-0 bottom-0 w-2" style="background-color: ${i.color || '#8c67ac'}"></div><div class="flex-1 text-center px-4 font-bold text-[15px] text-white truncate group-hover:scale-105 transition">${i.name}</div></a>`).join('')}</div>
            </div>`;
        const sl = document.getElementById('sl-mg'), bP = document.getElementById('btn-p-mg'), bN = document.getElementById('btn-n-mg');
        sl.onscroll = () => bP.classList.toggle('hidden', sl.scrollLeft<=20) || bP.classList.toggle('flex', sl.scrollLeft>20);
        bN.onclick = () => sl.scrollBy({left: sl.clientWidth*0.8, behavior:'smooth'});
        bP.onclick = () => sl.scrollBy({left: -sl.clientWidth*0.8, behavior:'smooth'});
    } catch(e){}
}

// ============================================================
// --- 6. PLAYER CONTROLLER CORE ---
// ============================================================

window.playMusic = async (index, newCtx = false) => {
    if (newCtx && window.viewingPlaylist?.length) currentPlaylist = [...window.viewingPlaylist];
    if (!currentPlaylist[index]) return;
    currentTrackIndex = index;
    const track = currentPlaylist[index];

    // Ưu tiên videoId nếu có
    const ytId = track.videoId || track.id;

    if (track.type === 'video' || (!track.audioUrl && ytId)) {
        activePlayerType = 'video'; audio.pause(); initYouTubePlayer(ytId);
    } else {
        activePlayerType = 'audio'; destroyYouTubePlayer();
        if (track.audioUrl) {
            audio.src = track.audioUrl;
            try { await audio.play(); saveState(); } catch (e) { if(e.name!=="AbortError") updatePlayBtn(false); }
        } else { alert("Chưa có link Audio!"); updatePlayBtn(false); return; }
    }
    els.bar.classList.remove("hidden"); els.bar.classList.add("flex");
    renderPlayerUI(track); highlightTrack(index); updatePlayBtn(true);
};

// Player Helpers
function initYouTubePlayer(videoId, startTime = 0) {
    if (!window.YT || !window.YT.Player) { setTimeout(() => initYouTubePlayer(videoId, startTime), 100); return; }
    
    if (!videoId || videoId.length < 5) return;

    const mainEmbed = document.getElementById('yt-player-embed');
    let targetId = mainEmbed ? 'yt-player-embed' : 'yt-mini-player-embed';

    if (!mainEmbed) {
        if (!document.getElementById('yt-hidden-container')) {
            const hiddenDiv = document.createElement('div');
            hiddenDiv.id = 'yt-hidden-container';
            hiddenDiv.style.cssText = 'position:fixed; bottom: 90px; right: 20px; width: 320px; height: 180px; z-index: 9999; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.5); background: #000;';
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = 'position:absolute; top:0; right:0; color:white; background:rgba(0,0,0,0.5); width:30px; height:30px; border:none; cursor:pointer; z-index:10000; font-size:20px;';
            closeBtn.onclick = (e) => { e.stopPropagation(); els.close.click(); }; 
            hiddenDiv.appendChild(closeBtn);
            const playerDiv = document.createElement('div'); playerDiv.id = targetId; hiddenDiv.appendChild(playerDiv);
            document.body.appendChild(hiddenDiv);
        } else { document.getElementById('yt-hidden-container').style.display = 'block'; }
    } else {
        const mini = document.getElementById('yt-hidden-container');
        if(mini) { if(ytPlayer) ytPlayer.destroy(); mini.remove(); }
    }
    
    if(ytPlayer) { try { ytPlayer.destroy(); } catch(e){} }
    ytPlayer = new YT.Player(targetId, {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: { 'autoplay': 1, 'controls': 1, 'start': startTime, 'playsinline': 1 },
        events: {
            'onStateChange': (e) => {
                if (e.data === 1) { updatePlayBtn(true); startVideoProgress(); activePlayerType = 'video'; }
                else if (e.data === 2) { updatePlayBtn(false); stopVideoProgress(); }
                else if (e.data === 0) els.next.click();
            },
            'onReady': (e) => { if(startTime>0) e.target.seekTo(startTime); e.target.setVolume(lastVolume * 100); }
        }
    });
}
function destroyYouTubePlayer() {
    if (ytPlayer) { try { ytPlayer.destroy(); } catch(e){} }
    ytPlayer = null; stopVideoProgress();
    const hiddenDiv = document.getElementById('yt-hidden-container');
    if (hiddenDiv) hiddenDiv.remove();
}
function startVideoProgress() {
    stopVideoProgress();
    videoProgressInterval = setInterval(() => {
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const cur = ytPlayer.getCurrentTime(), dur = ytPlayer.getDuration();
            updateProgressUI(cur, dur); saveState();
        }
    }, 1000);
}
function stopVideoProgress() { if (videoProgressInterval) clearInterval(videoProgressInterval); }

// --- 9. RENDER CHARTS (Bảng xếp hạng) ---
// ============================================================
export async function loadCharts() {
    const container = document.getElementById('charts-container');
    if (!container) return;

    try {
        // 1. Lấy danh sách quốc gia
        const resCountries = await fetch(`${API_BASE_URL}/charts/countries`);
        const dataCountries = await resCountries.json();
        const countries = dataCountries.countries || [];

        // Mặc định quốc gia
        let selectedCountry = 'VN'; 
        
        // Hàm render nội dung chính (Video + Artist)
        const renderContent = async (code) => {
            const contentDiv = document.getElementById('charts-content');
            contentDiv.innerHTML = '<div class="text-white p-4">Đang tải dữ liệu...</div>';

            try {
                // Gọi song song 2 API
                const [resVideos, resArtists] = await Promise.all([
                    fetch(`${API_BASE_URL}/charts/videos?country=${code}`),
                    fetch(`${API_BASE_URL}/charts/top-artists?country=${code}`)
                ]);

                const dataVideos = await resVideos.json();
                const dataArtists = await resArtists.json();
                
                const videos = dataVideos.items || [];
                const artists = dataArtists.items || [];

                contentDiv.innerHTML = `
                    <!-- SECTION 1: BXH VIDEO -->
                    <div class="mb-12 group/section">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-3xl font-bold text-white">Bảng xếp hạng video</h2>
                            <div class="flex gap-2">
                                <button id="btn-prev-cv" class="hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                                <button id="btn-next-cv" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                            </div>
                        </div>
                        <div id="scroll-cv" class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6">
                            ${videos.map((item, idx) => `
                                <a href="#/videos/details/${item.videoId}" class="w-[300px] shrink-0 cursor-pointer group flex flex-col">
                                    <div class="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-[#ffffff1a]">
                                        <img src="${item.thumb}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
                                        <!-- Số thứ tự -->
                                        <div class="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-black/60 text-white font-bold rounded-full border border-white/20">
                                            ${idx + 1}
                                        </div>
                                    </div>
                                    <h3 class="text-white font-bold text-[15px] truncate hover:underline">${item.title}</h3>
                                    <p class="text-[#909090] text-sm truncate mt-1">
                                        ${item.views ? (item.views / 1000).toLocaleString() + ' N' : 0} lượt xem
                                    </p>
                                </a>
                            `).join('')}
                        </div>
                    </div>

                    <!-- SECTION 2: NGHỆ SĨ HÀNG ĐẦU -->
                    <div class="mb-12 group/section">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-3xl font-bold text-white">Nghệ sĩ hàng đầu</h2>
                             <div class="flex gap-2">
                                <button id="btn-prev-ca" class="hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                                <button id="btn-next-ca" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                            </div>
                        </div>
                        <div id="scroll-ca" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${artists.map((artist, idx) => `
                                <div class="flex items-center gap-4 p-4 rounded-lg bg-[#ffffff0a] hover:bg-[#ffffff1a] transition cursor-pointer">
                                    <span class="text-2xl font-bold text-white w-8 text-center">${idx + 1}</span>
                                    
                                    <!-- Avatar nghệ sĩ (Giả lập) -->
                                    <div class="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    </div>
                                    
                                    <div class="flex flex-col">
                                        <h3 class="text-white font-bold text-[16px]">${artist.name}</h3>
                                        <p class="text-[#909090] text-xs">
                                            ${artist.totalViews ? (artist.totalViews / 1000000).toFixed(1) + ' Tr' : 0} views
                                        </p>
                                    </div>

                                    <!-- Trend Icon -->
                                    <div class="ml-auto text-xs font-bold ${artist.trend === 'up' ? 'text-green-500' : 'text-red-500'}">
                                        ${artist.trend === 'up' ? '▲' : '▼'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                // Setup Scroll logic
                const setupScroll = (id, p, n) => {
                    const el = document.getElementById(id), bP = document.getElementById(p), bN = document.getElementById(n);
                    if(el && bP && bN) {
                        el.onscroll = () => bP.classList.toggle('hidden', el.scrollLeft<=20) || bP.classList.toggle('flex', el.scrollLeft>20);
                        bN.onclick = () => el.scrollBy({left: el.clientWidth*0.8, behavior:'smooth'});
                        bP.onclick = () => el.scrollBy({left: -el.clientWidth*0.8, behavior:'smooth'});
                    }
                };
                setupScroll('scroll-cv', 'btn-prev-cv', 'btn-next-cv');

            } catch (err) {
                console.error(err);
                contentDiv.innerHTML = `<div class="text-red-500 p-4">Lỗi tải dữ liệu chi tiết.</div>`;
            }
        };

        // Render Khung chính + Dropdown Country
        container.innerHTML = `
            <div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">
                <h1 class="text-4xl font-bold text-white mb-6">Bảng xếp hạng</h1>
                
                <!-- Dropdown chọn quốc gia -->
                <div class="mb-8">
                    <select id="country-select" class="bg-[#212121] text-white border border-[#ffffff1a] rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-[#333] transition appearance-none">
                        ${countries.map(c => `<option value="${c.code}" ${c.code === selectedCountry ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>

                <!-- Nơi chứa nội dung Video & Artist -->
                <div id="charts-content"></div>
            </div>
        `;

        // Sự kiện đổi quốc gia
        const select = document.getElementById('country-select');
        select.addEventListener('change', (e) => {
            renderContent(e.target.value);
        });

        // Load lần đầu
        renderContent(selectedCountry);

    } catch (e) {
        console.error("Lỗi tải Charts:", e);
        container.innerHTML = `<div class="text-red-500 text-center mt-10">Lỗi tải dữ liệu Bảng xếp hạng.</div>`;
    }
}

// Events
// CLICK BAR TO OPEN VIDEO
if (els.infoArea) {
    els.infoArea.style.cursor = 'pointer';
    els.infoArea.onclick = () => {
        const track = currentPlaylist[currentTrackIndex];
        
        if (track) {
            // Lấy ID nội bộ chuẩn (ưu tiên encodeId nếu có, sau đó là id)
            const targetId = track.encodeId || track.id; 

            if (targetId) {
                if (activePlayerType === 'video') {
                    // Nếu đang xem Video -> Chuyển về trang chi tiết Video
                    window.location.hash = `/videos/details/${targetId}`;
                } else {
                    // Nếu đang nghe Audio -> Chuyển về trang chi tiết Bài hát
                    window.location.hash = `/songs/details/${targetId}`;
                }
            }
        }
    };
}
els.play.onclick = () => {
    if (activePlayerType === 'audio') audio.paused ? (audio.play(), updatePlayBtn(true)) : (audio.pause(), updatePlayBtn(false));
    else if (activePlayerType === 'video' && ytPlayer) (ytPlayer.getPlayerState()===1) ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    saveState();
};
//các nút trên thanh audio
els.next.onclick = () => window.playMusic(currentTrackIndex+1 >= currentPlaylist.length ? 0 : currentTrackIndex+1);
els.prev.onclick = () => window.playMusic(currentTrackIndex-1 < 0 ? currentPlaylist.length-1 : currentTrackIndex-1);
els.btnVol.onclick = () => { const v = audio.volume > 0 ? 0 : lastVolume; els.slider.value = v; setAllVolume(v); };
els.slider.oninput = (e) => setAllVolume(+e.target.value);
function setAllVolume(val) { audio.volume = val; if(val>0) lastVolume = val; if(ytPlayer?.setVolume) ytPlayer.setVolume(val*100); updateVolIcon(val); saveState(); }
els.cont.onclick = (e) => {
    const pct = e.offsetX / els.cont.clientWidth;
    if (activePlayerType === 'audio' && audio.duration) audio.currentTime = pct * audio.duration;
    else if (activePlayerType === 'video' && ytPlayer) ytPlayer.seekTo(pct * ytPlayer.getDuration(), true);
    saveState();
};
els.close.onclick = () => { audio.pause(); destroyYouTubePlayer(); updatePlayBtn(false); els.bar.classList.add("hidden"); els.bar.classList.remove("flex"); currentPlaylist=[]; saveState(); };
audio.ontimeupdate = () => { if(activePlayerType==='audio') updateProgressUI(audio.currentTime, audio.duration); };
audio.onended = () => els.next.click();

// Helpers UI, giao diện trên thanh audio
function renderPlayerUI(t) { els.title.innerText = t.title || t.name || "Unknown"; els.img.src = (t.thumbnails && t.thumbnails[0]) ? (t.thumbnails[0].url || t.thumbnails[0]) : (t.thumb || 'https://picsum.photos/50'); els.artist.innerText = Array.isArray(t.artists) ? t.artists.map(a => a.name).join(', ') : (t.artist?.name || 'Unknown'); }
function updatePlayBtn(p) { els.iconPlay.classList.toggle("hidden", p); els.iconPause.classList.toggle("hidden", !p); }
function updateVolIcon(v) { els.volOn.classList.toggle("hidden", v === 0); els.volMute.classList.toggle("hidden", v > 0); els.btnVol.classList.toggle("text-red-500", v === 0); }
function updateProgressUI(c, d) { if(d>0) { els.progress.style.width = `${(c/d)*100}%`; els.curTime.innerText = fmtTime(c); els.durTime.innerText = fmtTime(d); } }

window.onbeforeunload = saveState;
loadState();