export const Sidebar = () => {
    return `
      <aside class="fixed top-16 left-0 w-64 h-[calc(100vh-64px-80px)] bg-[#030303] text-white p-3 hidden md:flex flex-col gap-1 z-40 overflow-y-auto">
          <a href="#" class="flex items-center gap-4 px-4 py-3 bg-[#222] rounded-lg transition text-white">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              <span class="font-medium text-sm">Trang chủ</span>
          </a>
          <a href="#" class="flex items-center gap-4 px-4 py-3 hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              <span class="font-medium text-sm">Khám phá</span>
          </a>
          <a href="#" class="flex items-center gap-4 px-4 py-3 hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>
              <span class="font-medium text-sm">Thư viện</span>
          </a>
          <div class="border-t border-[#222] my-2 mx-4"></div>
          <div class="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Playlist của bạn</div>
          <!-- Demo list -->
          <div class="px-4 py-2 text-gray-400 hover:text-white cursor-pointer text-sm font-medium truncate">Nhạc Code Dạo</div>
          <div class="px-4 py-2 text-gray-400 hover:text-white cursor-pointer text-sm font-medium truncate">Chill Lofi Study</div>
      </aside>
    `;
};