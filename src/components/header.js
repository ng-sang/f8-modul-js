import { getUser, logout } from '../api.js';
import { API_BASE_URL } from '../config.js';

export function renderHeader() {
  const user = getUser();
  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'U';
  const userSectionHtml = user 
    ? `<div class="relative group"><button id="user-menu-btn" class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold cursor-pointer">${firstLetter}</button><div id="user-dropdown" class="absolute right-0 top-full mt-2 w-48 bg-[#212121] border border-[#333] rounded-lg shadow-xl z-50 hidden flex-col overflow-hidden"><div class="px-4 py-3 border-b border-[#333]"><p class="text-sm text-white font-bold truncate">${user.name}</p><p class="text-xs text-gray-400 truncate">${user.email}</p></div><a href="#/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">Thông tin</a><a href="#/change-password" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">Đổi mật khẩu</a><button id="btn-logout-dropdown" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition border-t border-[#333]">Đăng xuất</button></div></div>`
    : `<a href="#/login" class="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition">Đăng nhập</a>`;

  return `
    <header class="h-16 flex items-center justify-between px-4 border-b border-[#1f1f1f] sticky top-0 bg-yt-black z-50">
      <div class="flex items-center gap-4"><button class="p-2 hover:bg-white/10 rounded-full"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><a href="#/" class="flex items-center gap-1 cursor-pointer"><div class="rounded-full"><img src="/img/logo.png" class="w-6 h-6 rounded-full flex items-center justify-center"/></div><span class="text-xl font-bold tracking-tight text-white">Music</span></a></div>
      <div class="relative flex-1 max-w-[500px] hidden md:block">
        <div class="flex items-center bg-[#212121] rounded-lg px-4 py-2 border border-[#333]">
          <svg class="w-5 h-5 text-yt-text mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input id="search-input" type="text" placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ" class="bg-transparent border-none outline-none text-white w-full placeholder-[#909090] text-[15px]" autocomplete="off">
        </div>
        <div id="search-dropdown-wrapper" class="absolute top-full left-0 w-full bg-[#212121] border-x border-b border-[#333] rounded-b-lg shadow-2xl z-[100] overflow-hidden hidden">
            <div id="search-suggestions" class="w-full pb-2 hidden"></div>
            <div id="search_completed" class="w-full pb-2 hidden"></div>
        </div>
      </div>
      <div class="flex items-center gap-4"><button class="hidden sm:block text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></button>${userSectionHtml}</div>
    </header>
  `;
}

export function initHeaderLogic() {
    search_input();
    
    // Logic Dropdown User
    const btnUser = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    const btnLogout = document.getElementById('btn-logout-dropdown');

    if (btnUser && dropdown) {
        btnUser.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); dropdown.classList.toggle('flex'); });
        document.addEventListener('click', (e) => { if (!btnUser.contains(e.target) && !dropdown.contains(e.target)) { dropdown.classList.add('hidden'); dropdown.classList.remove('flex'); } });
        if (btnLogout) btnLogout.addEventListener('click', () => { if(confirm('Đăng xuất?')) logout(); });
    }
}

export function search_input() {
    const input = document.getElementById('search-input');
    const wrapper = document.getElementById('search-dropdown-wrapper');
    if (!input) return;
    
    // 1. Xử lý Gợi ý khi gõ (Input)
    let timeout = null;
    input.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          if (value) even_search(value);
          else wrapper.classList.add('hidden');
      }, 300);
    });

    // 2. Xử lý tìm kiếm khi nhấn ENTER (Keydown) 
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (value) {
                // Chuyển hướng URL để Router bắt được
                window.location.hash = `/search/${encodeURIComponent(value)}`;
                wrapper.classList.add('hidden'); // Ẩn gợi ý
                input.blur(); // Bỏ focus
            }
        }
    });

    document.addEventListener('click', (e) => { if (!input.contains(e.target) && !wrapper.contains(e.target)) wrapper.classList.add('hidden'); });
}

// Logic gợi ý 
async function even_search(key) {
    const wrapper = document.getElementById('search-dropdown-wrapper');
    const suggestionsEl = document.getElementById('search-suggestions');
    const completedEl = document.getElementById('search_completed');

    try {
        const response = await fetch(`${API_BASE_URL}/search/suggestions?q=${key}`);
        const data = await response.json();     
        const suggestions = data.suggestions || [];
        const completed = data.completed || [];

        if (suggestions.length > 0) {
            const listHtml = suggestions.map(text => `<div onclick="window.location.hash='/search/${encodeURIComponent(text)}'; document.getElementById('search-dropdown-wrapper').classList.add('hidden');" class="px-4 py-2.5 text-[15px] font-bold text-white hover:bg-[#ffffff1a] cursor-pointer transition select-none">${text}</div>`).join("");
            suggestionsEl.innerHTML = `<div class="px-4 pt-4 pb-2 text-sm font-bold text-[#aaa]">Gợi ý</div>${listHtml}`;
            suggestionsEl.classList.remove('hidden');
        } else { suggestionsEl.innerHTML = ''; suggestionsEl.classList.add('hidden'); }

        if (completed.length > 0) {
            const listHtml = completed.map(item => `<div onclick="window.location.hash='/search/${encodeURIComponent(item.title)}'; document.getElementById('search-dropdown-wrapper').classList.add('hidden');" class="px-4 py-2 hover:bg-[#ffffff1a] cursor-pointer flex items-center gap-3 transition group select-none"><img src="${item.thumbnails}" class="w-12 h-12 object-cover rounded-sm shadow-sm"><div class="flex flex-col overflow-hidden"><span class="text-[15px] font-bold text-white truncate">${item.title}</span><span class="text-sm text-[#aaa] truncate">${item.artists?.map(a=>a.name).join(', ')||'Nghệ sĩ'}</span></div></div>`).join("");
            completedEl.innerHTML = `<div class="px-4 pt-3 pb-2 text-sm font-bold text-[#aaa]">Kết quả</div>${listHtml}`;
            completedEl.classList.remove('hidden');
        } else { completedEl.innerHTML = ''; completedEl.classList.add('hidden'); }

        if (suggestions.length > 0 || completed.length > 0) wrapper.classList.remove('hidden');
        else wrapper.classList.add('hidden');
    } catch (e) { console.error(e); wrapper.classList.add('hidden'); }
}