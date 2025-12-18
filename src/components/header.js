
import { getUser, logout } from '../api.js';

export function renderHeader() {
  const user = getUser(); // Lấy thông tin user từ localStorage

  // Logic hiển thị phần User bên phải
  let userSectionHtml = '';

  if (user) {
    // Đã đăng nhập
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    userSectionHtml = `
      <div class="flex items-center gap-3">
        <!-- Avatar (chữ cái đầu) -->
        <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold cursor-pointer" title="${user.email}">
           ${firstLetter}
        </div>
        <!-- Nút Đăng xuất -->
        <button id="btn-logout" class="text-gray-300 hover:text-white text-sm font-medium">
            Đăng xuất
        </button>
      </div>
    `;
  } else {
    // Chưa đăng nhập
    userSectionHtml = `
      <a href="#/login" class="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition">
        Đăng nhập
      </a>
    `;
  }

  // Trả về HTML Header đầy đủ
  return `
    <header class="h-16 flex items-center justify-between px-4 border-b border-[#1f1f1f] sticky top-0 bg-yt-black z-50">
      <!-- Left: Menu & Logo -->
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-white/10 rounded-full">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <a href="#/" class="flex items-center gap-1 cursor-pointer">
          <div class="rounded-full ">
           
            <img src="img/logo.png" class="w-6 h-6  rounded-full flex items-center justify-center"/>
          </div>
          <span class="text-xl font-bold tracking-tight text-white">Music</span>
        </a>
      </div>

      <!-- Center: Search -->
      <div class="flex-1 max-w-[500px] hidden md:block">
        <div class="flex items-center bg-[#212121] rounded-lg px-4 py-2 border border-[#333]">
          <svg class="w-5 h-5 text-yt-text mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ" class="bg-transparent border-none outline-none text-white w-full placeholder-[#909090] text-[15px]">
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-4">
        <button class="hidden sm:block text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></button>
        ${userSectionHtml}
      </div>
    </header>
  `;
}

