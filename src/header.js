import { auth } from './api.js';

// Hàm Header nhận vào tham số user (có thể null)
export const Header = (user) => {
  
  // Logic hiển thị phần bên phải
  let rightSectionHtml;

  if (user) {
    // ĐÃ ĐĂNG NHẬP: Hiển thị Avatar (chữ cái đầu tên)
    const firstLetter = user.name.charAt(0).toUpperCase();
    rightSectionHtml = `
      <div class="relative group ml-2">
        <!-- Avatar Button -->
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 font-bold text-white border border-red-400 hover:bg-purple-500">
          ${firstLetter}
        </button>

        <!-- Dropdown Menu  -->
        <div class="absolute right-0 top-[35px] hidden w-60 rounded-lg bg-[#282828] py-2 shadow-xl group-hover:block border border-white/10">
          <div class="px-4 py-3 border-b border-white/10">
            <p class="text-sm font-bold text-white truncate">${user.name}</p>
            <p class="text-xs text-gray-400 truncate">${user.email}</p>
          </div>
          
          <button id="btn-edit-profile" class="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-[#3E3E3E]">
            Chỉnh sửa hồ sơ
          </button>
          
          <button id="btn-logout" class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3E3E3E]">
            Đăng xuất
          </button>
        </div>
      </div>
    `;
  } else {
    // CHƯA ĐĂNG NHẬP: Hiển thị nút Login
    rightSectionHtml = `
      <button id="btn-login-popup" class="ml-2 flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-[#d9d9d9]">
        Đăng nhập
      </button>
    `;
  }

  // --- RETURN HTML STRING ---
  return `
    <header class="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#030303] px-4">
      
      <!-- Left: Logo -->
      <div class="flex min-w-[180px] items-center gap-4">
        <button class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
          <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </button>
        <a href="/" class="flex items-center gap-1 text-white">
          
           <img src="img/logo.png" class="flex h-6 w-6 items-center justify-center rounded-full  " />
          <span class="text-xl font-bold tracking-tighter">Music</span>
        </a>
      </div>

      <!-- Center: Search -->
      <div class="flex flex-1 justify-center px-4 max-w-[640px]">
        <div class="group flex h-10 w-full items-center rounded-lg border border-white/10 bg-[#212121] px-3 transition-colors focus-within:border-white/30 focus-within:bg-black hover:bg-[#2b2b2b]">
          <svg class="mr-3 h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
          <input type="text" placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ" class="w-full bg-transparent text-base text-white placeholder-gray-500 outline-none"/>
        </div>
      </div>

      <!-- Right: User Section -->
      <div class="flex min-w-[180px] items-center justify-end gap-2">
        ${rightSectionHtml}
      </div>
    </header>
  `;
};