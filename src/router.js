// src/router.js
import Navigo from 'navigo'; 
import { renderSidebar } from './components/sidebar.js';
// ... import existing components ...
import { renderMoodsContainer, initMoodsLogic } from './components/moods.js';
import { renderQuickPicks, initQuickPicksLogic } from './components/quick-picks.js';
import { renderSuggestedAlbums, initSuggestedAlbumsLogic } from './components/suggested-albums.js';
import { renderTodaysHits, initTodaysHitsLogic } from './components/todays-hits.js';
import { mods, loadAlbumDetails } from './api.js'; 

// IMPORT MỚI
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
      contentDiv.innerHTML = ''; 
      done();
    }
  });

  router
    .on('/', async () => {
       // ... logic trang chủ giữ nguyên
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

    // ... các route playlists/albums giữ nguyên ...
    .on('/playlists/details/:id', (match) => { mods(match.data.id); })
    .on('/albums/details/:slug', (match) => { loadAlbumDetails(match.data.slug); })

    // --- ROUTE LOGIN ---
    .on('/login', () => {
      contentDiv.innerHTML = renderLogin();
      initLoginLogic();
    })

    // --- ROUTE REGISTER ---
    .on('/register', () => {
      contentDiv.innerHTML = renderRegister();
      initRegisterLogic();
    })

    .notFound(() => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4">404 - Không tìm thấy trang</h1>`;
    });

  router.resolve();
}