import { API_BASE_URL } from '../config.js';

export function renderExplore() {
  return `
    <div class="max-w-[1200px] mx-auto pt-6 px-4 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <a href="/new-releases" class="flex items-center gap-4 bg-[#212121] hover:bg-[#333] transition p-4 rounded-lg border border-white/5 group"><div class="text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg></div><span class="text-white font-bold text-lg">Bản phát hành mới</span></a>
        <a href="/charts" class="flex items-center gap-4 bg-[#212121] hover:bg-[#333] transition p-4 rounded-lg border border-white/5 group"><div class="text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div><span class="text-white font-bold text-lg">Bảng xếp hạng</span></a>
        <a href="/moods-and-genres" class="flex items-center gap-4 bg-[#212121] hover:bg-[#333] transition p-4 rounded-lg border border-white/5 group"><div class="text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg></div><span class="text-white font-bold text-lg">Tâm trạng và thể loại</span></a>
      </div>

      <div class="w-full group/section mb-12">
          <div class="flex items-center justify-between mb-4"><h2 class="text-3xl font-bold text-white">Khám phá Albums mới</h2><div class="flex gap-2"><button id="btn-prev-explore" class="hidden w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><button id="btn-next-explore" class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div>
          <div id="explore-albums-list" class="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar w-full pb-6"><div class="text-gray-500 text-sm">Đang tải albums...</div></div>
      </div>

      <div class="w-full group/section mb-12">
          <div class="flex items-center justify-between mb-4"><h2 class="text-3xl font-bold text-white">Tâm trạng và thể loại</h2><div class="flex gap-2"><button id="btn-prev-moods" class="hidden w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><button id="btn-next-moods" class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div>
          <div id="explore-moods-list" class="grid grid-rows-4 grid-flow-col gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full pb-6"><div class="text-gray-500 text-sm">Đang tải dữ liệu...</div></div>
      </div>

      <div class="w-full group/section">
          <div class="flex items-center justify-between mb-4"><h2 class="text-3xl font-bold text-white">Video nhạc mới</h2><div class="flex gap-2"><button id="btn-prev-videos" class="hidden w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><button id="btn-next-videos" class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition disabled:opacity-30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div>
          <div id="explore-videos-list" class="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full pb-6"><div class="text-gray-500 text-sm">Đang tải videos...</div></div>
      </div>
    </div>
  `;
}

export async function initExploreLogic() {
    fetchAndRender(`${API_BASE_URL}/explore/albums`, 'explore-albums-list', 'btn-prev-explore', 'btn-next-explore', (items) => items.map(item => `<a href="/albums/details/${item.slug}" class="w-[180px] md:w-[200px] shrink-0 cursor-pointer group flex flex-col"><div class="relative w-full aspect-square rounded-md overflow-hidden mb-3"><img src="${item.thumb || 'https://picsum.photos/400'}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy"><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"><svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div></div><h3 class="text-white font-bold text-[16px] truncate hover:underline">${item.name}</h3><p class="text-[#909090] text-[14px] truncate mt-1">${item.albumType || 'Album'}</p></a>`).join(''));

    fetchAndRender(`${API_BASE_URL}/explore/meta`, 'explore-moods-list', 'btn-prev-moods', 'btn-next-moods', (data) => {
        const cats = (data.categories || []).map(i => ({...i, path: 'categories'}));
        const lines = (data.lines || []).map(i => ({...i, path: 'lines'}));
        return [...cats, ...lines].map(item => `<a href="/${item.path}/${item.slug}" class="relative flex items-center bg-[#292929] hover:bg-[#3e3e3e] rounded-md h-[56px] w-[200px] md:w-[220px] shrink-0 cursor-pointer overflow-hidden transition select-none group"><div class="absolute left-0 top-0 bottom-0 w-2" style="background-color: ${item.color || '#ccc'}"></div><div class="flex-1 text-center px-4 font-bold text-[15px] text-white truncate group-hover:scale-105 transition">${item.name}</div></a>`).join('');
    }, true);

    fetchAndRender(`${API_BASE_URL}/explore/videos`, 'explore-videos-list', 'btn-prev-videos', 'btn-next-videos', 
      (items) => items.map(item =>
      
         `<a href="/videos/details/${item.id}" class="w-[300px] md:w-[320px] shrink-0 cursor-pointer group flex flex-col"><div class="relative w-full aspect-video rounded-md overflow-hidden mb-3"><img src="${item.thumb || 'https://picsum.photos/320x180'}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy"><div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"><svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div></div><h3 class="text-white font-bold text-[16px] truncate hover:underline">${item.name}</h3><p class="text-[#909090] text-[14px] truncate mt-1">${item.views ? Math.floor(item.views / 1000) + ' N' : '0'} lượt xem</p></a>`).join(''));
}

async function fetchAndRender(url, containerId, prevBtnId, nextBtnId, renderCallback, isSpecialData = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const content = isSpecialData ? renderCallback(data) : ((data.items && data.items.length) ? renderCallback(data.items) : '<p class="text-gray-500 text-sm">Không có dữ liệu.</p>');
        container.innerHTML = content;
        
        const btnPrev = document.getElementById(prevBtnId), btnNext = document.getElementById(nextBtnId);
        container.onscroll = () => btnPrev?.classList.toggle('hidden', container.scrollLeft <= 20) || btnPrev?.classList.toggle('flex', container.scrollLeft > 20);
        btnNext?.addEventListener('click', () => container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' }));
        btnPrev?.addEventListener('click', () => container.scrollBy({ left: -(container.clientWidth * 0.8), behavior: 'smooth' }));
    } catch (e) { container.innerHTML = '<p class="text-red-500 text-sm">Lỗi tải dữ liệu.</p>'; }
}