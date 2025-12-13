export const Header = () => {
  return `
    <header class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-black text-white h-16 font-sans border-b border-[#212121]">
      
      <!-- --- Phần bên trái: Menu và Logo --- -->
      <div class="flex items-center gap-4">
        <!-- Nút Hamburger Menu -->
        <button class="p-2 hover:bg-white/10 rounded-full transition">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>

        <!-- Logo YouTube Music -->
        <a href="/" class="flex items-center gap-1" title="YouTube Music Home">
          <div class="w-8 h-8 relative flex items-center justify-center">
            <img src="img/logo.png">
          </div>
          <span class="text-xl font-bold tracking-tighter" style="letter-spacing: -1px;">Music</span>
        </a>
      </div>

      <!-- --- Phần giữa: Thanh tìm kiếm --- -->
      <div class="flex-1 max-w-xl mx-4 hidden md:block">
        <div class="flex items-center bg-[#212121] rounded-lg px-3 py-2 border border-transparent focus-within:border-white/30 transition-all">
          <!-- Icon kính lúp -->
          <svg class="w-6 h-6 text-gray-400 min-w-[24px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          
          <!-- Input tìm kiếm -->
          <input 
            type="text" 
            placeholder="Tìm bài hát, đĩa nhạc, nghệ sĩ" 
            class="bg-transparent border-none outline-none text-white w-full ml-3 placeholder-[#909090] text-[16px] font-medium"
          />
        </div>
      </div>

      <!-- --- Phần bên phải: Các nút chức năng --- -->
      <div class="flex items-center gap-1 sm:gap-4">
        
        <!-- Nút Cast -->
        <button class="p-2 hover:bg-white/10 rounded-full transition hidden sm:block">
  <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
    
    <path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
   
    <path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.92-11-11-11z"></path>
  </svg>
</button>

        <!-- Nút 3 chấm -->
        <button class="p-2 hover:bg-white/10 rounded-full transition hidden sm:block">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </button>

        <!-- Nút Đăng nhập -->
        <button id="login-btn" class="bg-white text-black px-4 py-1.5 rounded-full font-medium text-sm hover:bg-[#d9d9d9] transition whitespace-nowrap ml-2">
          Đăng nhập
        </button>
      </div>
    </header>
  `;
};
