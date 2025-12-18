

const BASE_URl = "https://youtube-music.f8team.dev/api";
const STORAGE_KEY = 'yt_music_player_state';

// --- KHAI BÁO BIẾN STATE ---
let currentPlaylist = []; // Danh sách bài hát đang phát thực tế
let currentTrackIndex = 0; // Vị trí bài đang phát
let lastVolume = 1;       // Lưu volume trước khi mute


const audioPlayer = document.getElementById("main-audio");
const playerBar = document.getElementById("player-bar");
const playBtn = document.getElementById("btn-play");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerImg = document.getElementById("player-img");
const timeCurrent = document.getElementById("current-time");
const timeTotal = document.getElementById("total-duration");
const volumeSlider = document.getElementById("volume-slider");
const btnVolume = document.getElementById("btn-volume");
const iconVolOn = document.getElementById("icon-vol-on");
const iconVolMute = document.getElementById("icon-vol-mute");

// --- 1. LOCAL STORAGE LOGIC (Lưu & Khôi phục) ---

function savePlayerState() {
    const state = {
        playlist: currentPlaylist,
        index: currentTrackIndex,
        currentTime: audioPlayer.currentTime,
        volume: audioPlayer.volume,
        // isPlaying: !audioPlayer.paused // Không cần lưu trạng thái play vì browser chặn autoplay
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadPlayerState() {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return;

    try {
        const state = JSON.parse(savedState);
        
        // Khôi phục Volume
        const savedVol = state.volume !== undefined ? state.volume : 1;
        audioPlayer.volume = savedVol;
        volumeSlider.value = savedVol;
        updateVolumeIcon(savedVol);

        // Khôi phục Playlist & Bài hát
        if (state.playlist && Array.isArray(state.playlist) && state.playlist.length > 0) {
            currentPlaylist = state.playlist;
            currentTrackIndex = state.index || 0;
            
            const track = currentPlaylist[currentTrackIndex];
            if (track) {
                // Render Player Bar
                playerBar.classList.remove("hidden");
                playerBar.classList.add("flex");
                renderPlayerUI(track);
                
                // Set source & time
                if (track.audioUrl) {
                    audioPlayer.src = track.audioUrl;
                    if (state.currentTime) {
                        audioPlayer.currentTime = state.currentTime;
                    }
                }
                
                // Highlight nếu đang ở trang danh sách tương ứng
                highlightTrack(currentTrackIndex);
            }
        }
        // Luôn để trạng thái Pause khi vừa F5 (Do chính sách Autoplay của trình duyệt)
        updatePlayBtn(false); 

    } catch (e) {
        console.error("Lỗi khôi phục trạng thái player:", e);
    }
}

// --- 2. LOGIC HIỂN THỊ (VIEW) ---

// A. Hiển thị Chi tiết Playlist
// A. Hiển thị Chi tiết Playlist (Hàm mods được viết lại)
export function mods(id) {
    async function fetchPlaylist(playlistId) {
        const container = document.getElementById('playlist-container'); // Selector ID mới
        if (!container) return;

        try {
            const response = await fetch(`${BASE_URl}/playlists/details/${playlistId}`);
            const data = await response.json();
            
            // 1. Lưu danh sách đang xem vào biến tạm
            window.viewingPlaylist = data.tracks || [];

            // 2. Xử lý dữ liệu hiển thị
            const title = data.title;
            const thumbnail = data.thumbnails ? data.thumbnails[0] : 'https://placehold.co/400';
            const description = data.description || ''; // Playlist thường có description
            const type = "Playlist"; // Mặc định là playlist

            // Xử lý thời gian
            const totalSeconds = data.duration || 0;
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const durationStr = h > 0 ? `${h} giờ ${m} phút` : `${m} phút`;
            const songCount = window.viewingPlaylist.length;

            // Xử lý Artist (nếu có)
            let artistName = "Various Artists";
            if (data.artists && Array.isArray(data.artists)) {
                artistName = data.artists.map(a => a.name).join(', ');
            }

            // 3. Render danh sách bài hát
            const tracksHTML = window.viewingPlaylist.map((track, index) => {
                const trackThumb = track.thumbnails ? track.thumbnails[0] : 'https://placehold.co/50';
                const trackDuration = track.duration || 0;
                const min = Math.floor(trackDuration / 60);
                const sec = trackDuration % 60;
                const timeDisplay = `${min}:${sec < 10 ? '0' + sec : sec}`;

                return `
                <li id="track-${index}" onclick="window.playMusic(${index}, true)" 
                    class="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer transition border-b border-transparent hover:border-transparent mb-2">
                    
                    <span class="w-8 text-center text-gray-400 font-medium text-sm group-hover:hidden">${index + 1}</span>
                    <span class="w-8 text-center hidden group-hover:block">
                        <svg class="w-5 h-5 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </span>

                    <div class="w-10 h-10 rounded overflow-hidden mr-4 shrink-0">
                        <img src="${trackThumb}" class="w-full h-full object-cover">
                    </div>

                    <div class="flex flex-col flex-grow overflow-hidden mr-4">
                        <span class="text-[15px] font-medium text-white truncate group-hover:underline">${track.title}</span>
                        <span class="text-xs text-gray-400 truncate">${track.artists ? track.artists.map(a=>a.name).join(', ') : ''}</span>
                    </div>

                    <span class="text-sm text-gray-400 font-mono">${timeDisplay}</span>
                </li>
                `;
            }).join("");

            // 4. Render Layout Chính (Giống layout Album)
            container.innerHTML = `
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 pt-6 pb-20">
                <!-- Cột Trái -->
                <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center text-center md:sticky md:top-4 h-fit">
                    <div class="w-[280px] h-[280px] md:w-full md:h-auto aspect-square rounded-lg overflow-hidden shadow-2xl mb-6">
                        <img src="${thumbnail}" alt="${title}" class="w-full h-full object-cover">
                    </div>
                    
                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">${title}</h1>
                    
                    <div class="text-[#aaaaaa] text-[15px] space-y-1 font-medium">
                        <p>${type} • ${artistName}</p>
                        <p>${songCount} bài hát • ${durationStr}</p>
                        ${data.year ? `<p>Năm: ${data.year}</p>` : ''}
                    </div>

                    <p class="text-gray-500 text-sm mt-4 line-clamp-3">${description}</p>
                    
                    <div class="flex gap-3 mt-6">
                        <button onclick="window.playMusic(0, true)" class="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
                            Phát tất cả
                        </button>
                         <button class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/10 text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Cột Phải -->
                <div class="flex-grow w-full min-w-0">
                    <ul class="flex flex-col">
                        ${tracksHTML}
                    </ul>
                </div>
            </div>`;
            
            // Highlight nếu bài đang hát nằm trong playlist này
            highlightTrack(currentTrackIndex);

        } catch (error) {
            console.error("Lỗi tải playlist:", error);
            container.innerHTML = `<div class="text-red-500">Lỗi tải playlist.</div>`;
        }
    }
    fetchPlaylist(id);
}


// B. Hiển thị Chi tiết Album
export async function loadAlbumDetails(slug) {
    const container = document.getElementById('album-container');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URl}/albums/details/${slug}`);
        const data = await response.json();

        // Lưu danh sách đang xem vào biến tạm
        window.viewingPlaylist = data.tracks || [];

        const title = data.title;
        const thumbnail = data.thumbnails ? data.thumbnails[0] : 'https://placehold.co/400';
        const description = data.description || '';
        const albumType = data.albumType || 'Album';
        
        let releaseDateStr = 'Unknown';
        if (data.releaseDate) {
            const d = new Date(data.releaseDate);
            releaseDateStr = d.toLocaleDateString('en-GB');
        }

        const totalSeconds = data.duration || 0;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const durationStr = h > 0 ? `${h} giờ ${m} phút` : `${m} phút`;
        const songCount = data.tracks ? data.tracks.length : 0;
        const views = data.popularity ? data.popularity : 0; 

        const tracksHTML = data.tracks.map((track, index) => {
            const trackThumb = track.thumbnails ? track.thumbnails[0] : 'https://placehold.co/50';
            const trackDuration = track.duration || 0;
            const min = Math.floor(trackDuration / 60);
            const sec = trackDuration % 60;
            const timeDisplay = `${min}:${sec < 10 ? '0' + sec : sec}`;

            // playMusic(index, true) -> true nghĩa là context mới
            return `
             <li id="track-${index}" onclick="window.playMusic(${index}, true)" 
                class="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer transition border-b border-transparent hover:border-transparent mb-2">
                
                <span class="w-8 text-center text-gray-400 font-medium text-sm group-hover:hidden">${index + 1}</span>
                <span class="w-8 text-center hidden group-hover:block">
                    <svg class="w-5 h-5 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </span>

                <div class="w-10 h-10 rounded overflow-hidden mr-4 shrink-0">
                    <img src="${trackThumb}" class="w-full h-full object-cover">
                </div>

                <div class="flex flex-col flex-grow overflow-hidden mr-4">
                    <span class="text-[15px] font-medium text-white truncate group-hover:underline">${track.title}</span>
                    <span class="text-xs text-gray-400 truncate">${track.artists ? track.artists.map(a=>a.name).join(', ') : ''}</span>
                </div>

                <span class="text-sm text-gray-400 font-mono">${timeDisplay}</span>
            </li>
            `;
        }).join('');

        container.innerHTML = `
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 pt-6 pb-20">
                <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center text-center md:sticky md:top-4 h-fit">
                    <div class="w-[280px] h-[280px] md:w-full md:h-auto aspect-square rounded-lg overflow-hidden shadow-2xl mb-6">
                        <img src="${thumbnail}" alt="${title}" class="w-full h-full object-cover">
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">${title}</h1>
                    <div class="text-[#aaaaaa] text-[15px] space-y-1 font-medium">
                        <p>${songCount} bài hát • ${durationStr}</p>
                        <p>${views} lượt nghe</p>
                        <p>Loại album: ${albumType}</p>
                        <p>Phát hành: ${releaseDateStr}</p>
                    </div>
                    <p class="text-gray-500 text-sm mt-4 line-clamp-3">${description}</p>
                    
                    <div class="flex gap-3 mt-6">
                        <button onclick="window.playMusic(0, true)" class="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
                            Phát tất cả
                        </button>
                         <button class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/10 text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="flex-grow w-full min-w-0">
                    <ul class="flex flex-col">
                        ${tracksHTML}
                    </ul>
                     <div class="mt-8 text-xs text-gray-500">
                        &copy; ${new Date(data.releaseDate).getFullYear()} ${data.artists ? data.artists.map(a=>a.name).join(', ') : 'Music'}
                    </div>
                </div>
            </div>
        `;
        
        highlightTrack(currentTrackIndex);

    } catch (error) {
        console.error("Lỗi tải Album:", error);
        container.innerHTML = `<div class="text-red-500 p-4">Không thể tải thông tin album.</div>`;
    }
}

// --- 3. LOGIC PLAYER NHẠC (CORE) ---

// isNewContext = true: Người dùng bấm vào list bài mới (Album/Playlist đang xem) -> Cần thay đổi danh sách phát
// isNewContext = false (mặc định): Bấm Next/Prev -> Giữ nguyên danh sách phát
window.playMusic = async function(index, isNewContext = false) {
    
    // Nếu click từ danh sách hiển thị -> Cập nhật danh sách phát
    if (isNewContext && window.viewingPlaylist && window.viewingPlaylist.length > 0) {
        currentPlaylist = [...window.viewingPlaylist];
    }

    if (!currentPlaylist || !currentPlaylist[index]) {
        console.error("Bài hát không tồn tại index:", index);
        return;
    }

    currentTrackIndex = index;
    const track = currentPlaylist[index];

    // Cập nhật giao diện
    playerBar.classList.remove("hidden");
    playerBar.classList.add("flex");
    renderPlayerUI(track);
    highlightTrack(index);
    updatePlayBtn(true);

    // Xử lý Audio
    if (track.audioUrl) {
        audioPlayer.src = track.audioUrl;
        try {
            await audioPlayer.play();
            savePlayerState(); // Lưu ngay khi bắt đầu phát
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Lỗi phát nhạc:", error);
                updatePlayBtn(false); 
            }
        }
    } else {
        alert("Bài hát này chưa có link Audio!");
        updatePlayBtn(false);
    }
};

// Hàm render thông tin bài hát lên thanh Player
function renderPlayerUI(track) {
    playerTitle.innerText = track.title || "Unknown Title";
    playerImg.src = track.thumbnails ? track.thumbnails[0] : 'https://placehold.co/50';
    
    let artistName = "Unknown";
    if(track.artists && Array.isArray(track.artists)) {
        artistName = track.artists.map(a => (typeof a === 'object' ? a.name : a)).join(', ');
    }
    playerArtist.innerText = artistName;
}

// Hàm highlight bài đang hát trong danh sách
function highlightTrack(index) {
    // Xóa style cũ
    document.querySelectorAll('li[id^="track-"]').forEach(li => {
        li.classList.remove("bg-white/10");
        // Kiểm tra xem bài hát trong list hiển thị có khớp với bài trong player không
        // Nếu khớp ID hoặc title thì mới highlight (đây làm đơn giản theo index nếu không đổi list)
    });

    // Thêm style mới
    const activeLi = document.getElementById(`track-${index}`);
    if (activeLi) {
        // Chỉ highlight nếu bài này thực sự thuộc danh sách đang phát
        // (Cách check đơn giản nhất: Nếu click từ list này thì highlight)
        activeLi.classList.add("bg-white/10");
    }
}

function updatePlayBtn(isPlaying) {
    if (isPlaying) {
        iconPlay.classList.add("hidden");
        iconPause.classList.remove("hidden");
    } else {
        iconPlay.classList.remove("hidden");
        iconPause.classList.add("hidden");
    }
}

// --- 4. SỰ KIỆN PLAYER ---

// Nút Play/Pause
playBtn.onclick = () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayBtn(true);
    } else {
        audioPlayer.pause();
        updatePlayBtn(false);
    }
    savePlayerState();
};

// Nút Next
nextBtn.onclick = () => {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= currentPlaylist.length) nextIndex = 0; 
    window.playMusic(nextIndex); // isNewContext = false (mặc định)
};

// Nút Prev
prevBtn.onclick = () => {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = currentPlaylist.length - 1;
    window.playMusic(prevIndex);
};

// Audio: Cập nhật thanh tiến trình
audioPlayer.ontimeupdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        timeCurrent.innerText = formatTime(currentTime);
        timeTotal.innerText = formatTime(duration);
    }
};

// Audio: Tự qua bài
audioPlayer.onended = () => {
    nextBtn.click();
};

// Tua nhạc
progressContainer.onclick = (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
        savePlayerState();
    }
};

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

// --- 5. VOLUME CONTROL ---

volumeSlider.oninput = (e) => {
    const vol = parseFloat(e.target.value);
    audioPlayer.volume = vol;
    updateVolumeIcon(vol);
    if (vol > 0) lastVolume = vol;
    savePlayerState();
};

btnVolume.onclick = () => {
    if (audioPlayer.volume > 0) {
        lastVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioPlayer.volume = lastVolume;
        volumeSlider.value = lastVolume;
    }
    updateVolumeIcon(audioPlayer.volume);
    savePlayerState();
};

function updateVolumeIcon(vol) {
    if (vol === 0) {
        iconVolOn.classList.add("hidden");
        iconVolMute.classList.remove("hidden");
        btnVolume.classList.add("text-red-500");
    } else {
        iconVolOn.classList.remove("hidden");
        iconVolMute.classList.add("hidden");
        btnVolume.classList.remove("text-red-500");
    }
}

// --- 6. SỰ KIỆN HỆ THỐNG ---

// Lưu trạng thái trước khi đóng tab/refresh
window.addEventListener("beforeunload", () => {
    savePlayerState();
});

// Chạy hàm load ngay khi file js được thực thi
const AUTH_KEY = 'yt_auth_token';
const USER_KEY = 'yt_auth_user';

// 1. Hàm gọi API Login
export async function login(email, password) {
    try {
        const response = await fetch(`${BASE_URl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        // Lưu thông tin vào LocalStorage
        localStorage.setItem(AUTH_KEY, data.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        // Phát sự kiện để Header/Sidebar cập nhật lại giao diện
        window.dispatchEvent(new Event('auth-change'));

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Lỗi Login:', error);
        return { success: false, message: error.message };
    }
}

// 2. Hàm gọi API Register
export async function register(name, email, password, confirmPassword) {
    try {
        const response = await fetch(`${BASE_URl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            // API thường trả về lỗi chi tiết trong data
            throw new Error(data.message || JSON.stringify(data) || 'Đăng ký thất bại');
        }

        // Đăng ký thành công cũng lưu luôn token (nếu API trả về)
        localStorage.setItem(AUTH_KEY, data.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        window.dispatchEvent(new Event('auth-change'));

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Lỗi Register:', error);
        return { success: false, message: error.message };
    }
}

// 3. Hàm Logout
export function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
    window.location.hash = '/'; // Quay về trang chủ
}

// 4. Helper: Lấy thông tin User hiện tại
export function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}
loadPlayerState();