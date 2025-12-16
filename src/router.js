// src/router.js

import Navigo from 'navigo'; // Import thư viện Navigo

// Import các component và logic (nhớ thêm .js nếu dùng Vite vanilla)
import { renderSidebar } from './components/sidebar.js';
import { renderMoodsContainer, initMoodsLogic } from './components/moods.js';
import { renderQuickPicks, initQuickPicksLogic } from './components/quick-picks.js';
import { renderSuggestedAlbums, initSuggestedAlbumsLogic } from './components/suggested-albums.js';
import { renderTodaysHits, initTodaysHitsLogic } from './components/todays-hits.js';

export function initRouter() {
  const contentDiv = document.querySelector('#main-content');
  const sidebarContainer = document.querySelector('#sidebar-container');

  // Khởi tạo Navigo
  // Tham số 1: Root URL (để null hoặc '/' nếu chạy từ gốc)
  // Tham số 2: { hash: true } để dùng dấu # trên URL (giống cách cũ của bạn)
  const router = new Navigo('/', { hash: true });

  // --- 1. Middleware (Hooks) ---
  // Chạy trước khi vào bất kỳ route nào để update Sidebar active
  router.hooks({
    before: (done, match) => {
      // Navigo trả về match.url không có dấu '/' ở đầu (ví dụ: 'explore'), 
      // ta cần thêm vào để khớp logic của Sidebar
      const currentPath = match.url ? `/${match.url}` : '/';
      sidebarContainer.innerHTML = renderSidebar(currentPath);
      
      // Xóa nội dung cũ để chuẩn bị render mới
      contentDiv.innerHTML = ''; 
      
      done(); // Báo cho Navigo biết là đã xử lý xong, tiếp tục vào route
    }
  });

  // --- 2. Định nghĩa Routes ---
  router
    .on('/', async () => {
      // Render HTML Trang chủ
      contentDiv.innerHTML = `
        <div class="max-w-[1200px] mx-auto pt-4 pb-20">
          ${renderMoodsContainer()} 
          ${renderQuickPicks()}
          ${renderSuggestedAlbums()}
          ${renderTodaysHits()}
          <div class="mt-8 p-4 text-center text-gray-500 text-sm">
             Cuối danh sách
          </div>
        </div>
      `;

      // Chạy logic Javascript (Async)
      await Promise.all([
        initMoodsLogic(),
        initQuickPicksLogic(),
        initSuggestedAlbumsLogic(),
        initTodaysHitsLogic()
      ]);
    })
    
    .on('/explore', () => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4">Khám phá</h1>`;
    })
    
    .on('/library', () => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4">Thư viện</h1>`;
    })

    // Route động: Lấy ID từ URL (Ví dụ: #/playlists/details/party-hits)
    // Dấu :id là tham số động
    .on('/playlists/details/:id', (match) => {
      // match.data.id sẽ chứa giá trị 'party-hits'
      const playlistId = match.data.id;
      console.log("Đang xem playlist:", playlistId);
      
      contentDiv.innerHTML = `
        <h1 class="text-3xl font-bold mt-4">Chi tiết Playlist</h1>
        <p class="text-gray-400">ID: ${playlistId}</p>
      `;
    })

    // Route 404 (Nếu không khớp cái nào ở trên)
    .notFound(() => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4">404 - Không tìm thấy trang</h1>`;
    });

  // --- 3. Kích hoạt Router ---
  router.resolve();
}