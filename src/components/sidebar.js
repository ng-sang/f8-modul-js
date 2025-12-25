import { getUser } from '../api.js';
export function renderSidebar(currentPath) {
  const user = getUser(); // Kiểm tra trạng thái đăng nhập

  // Hàm helper tạo item sidebar
  const navItem = (path, iconPath, label, isActive) => `
    <a href="#${path}" class="flex flex-col items-center justify-center py-4 px-2 w-[90%] rounded-xl mb-1 transition duration-200 group ${isActive ? 'bg-[#1f1f1f] text-white' : 'text-[#909090] hover:bg-[#1f1f1f] hover:text-white'}">
      <svg class="w-6 h-6 mb-1 ${isActive ? 'fill-white' : 'fill-transparent stroke-current'}" stroke-width="${isActive ? '0' : '2'}" viewBox="0 0 24 24">
        ${iconPath}
      </svg>
      <span class="text-[11px] font-medium">${label}</span>
    </a>
  `;

  // Icon paths
  const homeIcon = '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>';
  const exploreIcon = '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13l4 6-6 4 2-6z"></path>';
  const libraryIcon = '<path d="M4 6h16M4 12h16m-7 6h7"></path>';

  // Logic hiển thị nút Đăng nhập
  
  const loginButtonHtml = user ? '' : `
    <div class="w-8 h-[1px] bg-[#212121] my-4"></div>
    <a href="#/login" class="flex flex-col items-center justify-center py-2 cursor-pointer text-[#909090] hover:text-white transition group">
       <div class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mb-1">
          <div class="w-2 h-2 bg-current rounded-full"></div>
       </div>
       <span class="text-[11px] font-medium">Đăng nhập</span>
    </a>
  `;

  return `
    <aside class="w-[100px] h-full bg-yt-black flex flex-col items-center py-2 border-r border-[#1f1f1f]">
      ${navItem('/', homeIcon, 'Trang chủ', currentPath === '/' || currentPath === '')}
      ${navItem('/explore', exploreIcon, 'Khám phá', currentPath === '/explore')}
      ${navItem('/library', libraryIcon, 'Thư viện', currentPath === '/library')}
      
      ${loginButtonHtml}
    </aside>
  `;
}