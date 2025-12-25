import { API_BASE_URL } from '../../config.js';

export function renderVietnameseMusic() {
  return `
    <div class="w-full mb-10 group/section">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-3xl font-bold text-white">Nhạc Việt</h2>
        
        <div class="flex gap-2">
           <button id="btn-prev-vn" class="hidden w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] items-center justify-center transition disabled:opacity-30">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button id="btn-next-vn" class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition disabled:opacity-30">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
        </div>
      </div>

      <!-- Slider Container -->
      <div 
        id="vietnamese-music-list" 
        class="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar w-full pb-4"
      >
        <!-- Skeleton Loading -->
        ${[1, 2, 3, 4, 5, 6].map(() => `
          <div class="w-[200px] shrink-0">
            <div class="w-full aspect-square bg-[#ffffff1a] rounded-md animate-pulse mb-3"></div>
            <div class="h-4 w-3/4 bg-[#ffffff1a] rounded animate-pulse mb-2"></div>
            <div class="h-3 w-1/2 bg-[#ffffff1a] rounded animate-pulse"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export async function initVietnameseMusicLogic() {
  const container = document.getElementById('vietnamese-music-list');
  const btnPrev = document.getElementById('btn-prev-vn');
  const btnNext = document.getElementById('btn-next-vn');

  if (!container) return;

  try {

    const response = await fetch(`${API_BASE_URL}/playlists/by-country?country=VN`);
    const data = await response.json();

      const html = data.map(item => {
        const title = item.title;
        // Theo hình log: thumbnails là mảng string ['url'], artists là mảng string ['Ten Ca Si']
        const thumb = item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails[0] : 'https://placehold.co/400';
        const artists = Array.isArray(item.artists) ? item.artists.join(', ') : 'Nghệ sĩ Việt';

        return `
          <a href="#/playlists/details/${item.slug}" class="w-[200px] shrink-0 cursor-pointer group flex flex-col">
            <!-- Image Container -->
            <div class="relative w-full aspect-square rounded-md overflow-hidden mb-3">
              <img src="${thumb}" alt="${title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
              
              <!-- Hover Overlay with Play Icon -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                 <button class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                    <svg class="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </button>
              </div>
            </div>

            <!-- Info -->
            <h3 class="text-white font-bold text-[16px] truncate hover:underline" title="${title}">${title}</h3>
            <p class="text-[#909090] text-[14px] truncate mt-1 hover:text-white transition">
               ${artists}
            </p>
          </a>
        `;
      }).join('');
      
      container.innerHTML = html;
  } catch (error) {
    console.error('Lỗi tải Nhạc Việt:', error);
    container.innerHTML = '';
  }


  const handleScroll = () => {
    if (container.scrollLeft > 20) {
      btnPrev.classList.remove('hidden');
      btnPrev.classList.add('flex');
    } else {
      btnPrev.classList.add('hidden');
      btnPrev.classList.remove('flex');
    }
  };

  container.addEventListener('scroll', handleScroll);

  btnNext.addEventListener('click', () => {
    container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
  });

  btnPrev.addEventListener('click', () => {
    container.scrollBy({ left: -(container.clientWidth * 0.8), behavior: 'smooth' });
  });
}