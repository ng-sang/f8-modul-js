import './style.css';
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { initEvents } from "./even"; 
 

const appEL = document.querySelector("#app");


appEL.innerHTML = `${Header()}
<div class="flex  pt-16">
      ${Sidebar()}
      
      <!-- Khu vực nội dung chính (Main Content) -->
      <!-- Thêm padding-left (ml-[72px]) bằng đúng chiều rộng sidebar để nội dung không bị che -->
      <main class="flex-1 min-h-screen bg-black text-white ml-[0px] md:ml-[72px] p-8">
          <h1 class="text-3xl font-bold">Nội dung trang chủ</h1>
          <p class="mt-4 text-gray-400">Danh sách bài hát sẽ hiện ở đây...</p>
      </main>
  </div>
`;

initEvents();