import { explore1 } from "./explore";
import { home } from "./home";

export const Sidebar = () => {
  return `
    <aside class="flex flex-wrap flex-grow-[1]  h-[100vh] w-[8%]  items-center bg-[#0c0a0a] ">
      
      <!-- NAV GROUP 1 -->
      <div class="flex w-full flex-col px-1">
        
     
        ${home()}

        <!-- KHÁM PHÁ -->
        ${explore1()}

        <!-- THƯ VIỆN -->
        <a href="#" class="mb-2 flex w-full flex-col items-center justify-center rounded-lg py-4 text-[#909090] transition-colors hover:bg-[#2b2b2b] hover:text-white">
          <svg class="mb-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
             <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"></path>
          </svg>
          <span class="text-[10px] font-medium tracking-wide">Thư viện</span>
        </a>

      </div>

      <!-- DIVIDER (Đường kẻ ngang) -->
      <div class="my-2 h-[1px] w-6 bg-white/10"></div>

      <!-- NAV GROUP 2 -->
      <div class="flex w-full flex-col px-1">
        
       

      </div>
      
    </aside>
  `;
};