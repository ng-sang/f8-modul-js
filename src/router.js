

import Navigo from 'navigo';
import { renderSidebar } from './components/sidebar.js';

import { renderMoodsContainer, initMoodsLogic } from './components/moods.js';
import { renderQuickPicks, initQuickPicksLogic } from './components/quick-picks.js';
import { renderSuggestedAlbums, initSuggestedAlbumsLogic } from './components/suggested-albums.js';
import { renderTodaysHits, initTodaysHitsLogic } from './components/todays-hits.js';
import { mods, loadAlbumDetails } from './api.js';
import { renderExplore, initExploreLogic } from './components/explore.js';
import { renderLogin, initLoginLogic } from './components/login.js';
import { renderRegister, initRegisterLogic } from './components/register.js';

export function initRouter() {
  const contentDiv = document.querySelector('#main-content');
  const sidebarContainer = document.querySelector('#sidebar-container');
  const router = new Navigo('/', { hash: true });

  router.hooks({
    before: (done, match) => {
      const currentPath = match.url ? `/${match.url}` : '/';
      sidebarContainer.innerHTML = renderSidebar(currentPath);
      // Xóa nội dung cũ
      contentDiv.innerHTML = ''; 
      done();
    }
  });

  router
    .on('/', async () => {
      contentDiv.innerHTML = `
        <div class="max-w-[1200px] mx-auto pt-4 pb-20">
          ${renderMoodsContainer()} 
          ${renderQuickPicks()}
          ${renderSuggestedAlbums()}
          ${renderTodaysHits()}
        </div>
      `;
      await Promise.all([
        initMoodsLogic(),
        initQuickPicksLogic(),
        initSuggestedAlbumsLogic(),
        initTodaysHitsLogic()
      ]);
    })
    
    .on('/explore', async () => {
      contentDiv.innerHTML = renderExplore();
      await initExploreLogic();
    })
    
    .on('/library', () => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4 px-4 text-white">Thư viện (Đang phát triển)</h1>`;
    })

    
    .on('/playlists/details/:id', (match) => { 
        // 1. Tạo container trước
        contentDiv.innerHTML = `<div id="playlist-container" class="text-white p-4">Đang tải playlist...</div>`;
        // 2. Gọi hàm load dữ liệu
        mods(match.data.id); 
    })

    .on('/albums/details/:slug', (match) => { 
        // 1. Tạo container trước
        contentDiv.innerHTML = `<div id="album-container" class="text-white p-4">Đang tải album...</div>`;
        // 2. Gọi hàm load dữ liệu
        loadAlbumDetails(match.data.slug); 
    })
    // ------------------------

    .on('/login', () => {
      contentDiv.innerHTML = renderLogin();
      initLoginLogic();
    })

    .on('/register', () => {
      contentDiv.innerHTML = renderRegister();
      initRegisterLogic();
    })

    .notFound(() => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4 text-white p-4">404 - Không tìm thấy trang</h1>`;
    });

  router.resolve();
}