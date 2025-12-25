import Navigo from 'navigo';
import { renderSidebar } from './components/sidebar.js';
import { renderMoodsContainer, initMoodsLogic } from './components/home/moods.js';
import { renderSuggestedAlbums, initSuggestedAlbumsLogic } from './components/home/albums_for_you.js';
import { renderTodaysHits, initTodaysHitsLogic } from './components/home/todays-hits.js';
import { renderVietnameseMusic, initVietnameseMusicLogic } from './components/home/vietnamese_music.js';
import { renderWelcome } from './components/home/welcome.js'; 
import { renderQuickPicks, initQuickPicksLogic } from './components/quick-picks.js';
import { renderExplore, initExploreLogic } from './components/explore.js';
import { renderLogin, initLoginLogic } from './components/login.js';
import { renderRegister, initRegisterLogic } from './components/register.js';
import { mods, loadAlbumDetails, loadCategoryDetails, loadLineDetails, loadVideoDetails, loadSearchResults, loadState, loadSongDetails, loadNewReleases, loadMoodsAndGenres, loadCharts, loadMoodDetail  } from './api.js';
import { renderProfile, initProfileLogic, renderChangePassword, initChangePasswordLogic  } from './components/profile.js';

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
    },
    after: () => {
        loadState(); 
    }
  });

   router
    .on('/', async () => {
      contentDiv.innerHTML = `
        <div class="max-w-[1200px] mx-auto pt-4 pb-20">
          
         
          <div id="welcome-wrapper">
             ${renderWelcome()}
          </div>
          <!-- -------------------------------------------------- -->

          ${renderMoodsContainer()} 
          ${renderQuickPicks()}
          ${renderSuggestedAlbums()}
          ${renderTodaysHits()}
          ${renderVietnameseMusic()}
        </div>
      `;
      
      await Promise.all([
        initMoodsLogic(),
        initQuickPicksLogic(),
        initSuggestedAlbumsLogic(),
        initTodaysHitsLogic(),
        initVietnameseMusicLogic()
      ]);
    })
    .on('/profile', () => {
        contentDiv.innerHTML = renderProfile();
        initProfileLogic();
    })
    .on('/change-password', () => {
        contentDiv.innerHTML = renderChangePassword();
        initChangePasswordLogic();
    })
    .on('/explore', async () => {
      contentDiv.innerHTML = renderExplore();
      await initExploreLogic();
    })
    
    .on('/library', () => {
      contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4 px-4 text-white">Thư viện (Đang phát triển)</h1>`;
    })

    .on('/playlists/details/:id', (match) => { 
        contentDiv.innerHTML = `<div id="playlist-container" class="text-white p-4">Đang tải playlist...</div>`;
        mods(match.data.id); 
    })

    .on('/albums/details/:slug', (match) => { 
        contentDiv.innerHTML = `<div id="album-container" class="text-white p-4">Đang tải album...</div>`;
        loadAlbumDetails(match.data.slug); 
    })
    
    .on('/categories/:slug', (match) => { 
        contentDiv.innerHTML = `<div id="category-container" class="text-white p-4">Đang tải danh mục...</div>`;
        loadCategoryDetails(match.data.slug); 
    })

    .on('/lines/:slug', (match) => { 
        contentDiv.innerHTML = `<div id="line-container" class="text-white p-4">Đang tải bài hát...</div>`;
        loadLineDetails(match.data.slug); 
    })

    .on('/videos/details/:id', (match) => { 
        contentDiv.innerHTML = `<div id="video-container" class="text-white p-4">Đang tải video...</div>`;
        loadVideoDetails(match.data.id); 
    })

    .on('/songs/details/:id', (match) => {
        contentDiv.innerHTML = `<div id="song-detail-container" class="text-white p-4">Đang tải bài hát...</div>`;
        loadSongDetails(match.data.id);
    })

 .on('/search/:keyword', (match) => {
        contentDiv.innerHTML = `<div id="search-results" class="text-white p-4">Đang tìm kiếm...</div>`;
        loadSearchResults(match.data.keyword);
    })
    .on('/charts', () => {
        contentDiv.innerHTML = `<div id="charts-container" class="text-white p-4">Đang tải bảng xếp hạng...</div>`;
        loadCharts();
    })
    .on('/login', () => { contentDiv.innerHTML = renderLogin(); initLoginLogic(); })
    .on('/register', () => { contentDiv.innerHTML = renderRegister(); initRegisterLogic(); })
    .on('/new-releases', () => {
        contentDiv.innerHTML = `<div id="new-releases-container" class="text-white p-4">Đang tải bản phát hành mới...</div>`;
        loadNewReleases();
    })
     .on('/moods-and-genres', () => {
        contentDiv.innerHTML = `<div id="moods-genres-container" class="text-white p-4">Đang tải...</div>`;
        loadMoodsAndGenres();
    })
    .on('/moods/:slug', (match) => {
        contentDiv.innerHTML = `<div id="mood-detail-container" class="text-white p-4">Đang tải mood...</div>`;
        
        loadMoodDetail(match.data.slug);
    })
    .notFound(() => { 
        contentDiv.innerHTML = `<h1 class="text-3xl font-bold mt-4 text-white p-4">404 - Không tìm thấy trang</h1>`; 
    });

  router.resolve();
}