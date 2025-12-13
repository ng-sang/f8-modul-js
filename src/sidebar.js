export const Sidebar = () => {
  return `
    <aside class="w-[72px] bg-black h-full flex flex-col items-center py-2 fixed left-0 top-16 border-r border-transparent z-40 hidden md:flex">
      
      <!-- Nút Trang chủ (Đang Active) -->
      <a href="#" class="flex flex-col items-center justify-center w-16 py-3.5 mb-1 rounded-xl bg-[#212121] text-white transition hover:bg-[#212121]">
        <svg class="w-6 h-6 mb-1 fill-current" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
        </svg>
        <span class="text-[10px] font-medium">Trang chủ</span>
      </a>

      <!-- Nút Khám phá -->
      <a href="#" class="flex flex-col items-center justify-center w-16 py-3.5 mb-1 rounded-xl text-white hover:bg-white/10 transition">
        <svg class="w-6 h-6 mb-1 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"></path>
        </svg>
        <span class="text-[10px] font-medium">Khám phá</span>
      </a>

      <!-- Nút Thư viện -->
      <a href="#" class="flex flex-col items-center justify-center w-16 py-3.5 mb-1 rounded-xl text-white hover:bg-white/10 transition">
        <svg class="w-6 h-6 mb-1 fill-current" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"></path>
        </svg>
        <span class="text-[10px] font-medium">Thư viện</span>
      </a>

      <!-- Đường kẻ ngăn cách -->
      <div class="w-6 h-[1px] bg-[#333] my-3"></div>

      <!-- Nút Đăng nhập -->
      <a href="#" class="flex flex-col items-center justify-center w-16 py-3.5 rounded-xl text-white hover:bg-white/10 transition">
        <svg class="w-6 h-6 mb-1 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
        </svg>
        <span class="text-[10px] font-medium">Đăng nhập</span>
      </a>

    </aside>
  `;
};