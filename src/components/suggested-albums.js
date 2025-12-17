// src/components/suggested-albums.js

export function renderSuggestedAlbums() {
  return `
    <div class="w-full mb-10 group/section">
      <!-- Header: Title + Navigation Buttons -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-3xl font-bold text-white">Album gợi ý cho bạn</h2>
        
        <div class="flex gap-2">
           <button id="btn-prev-albums" class="hidden w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] items-center justify-center transition disabled:opacity-30">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button id="btn-next-albums" class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition disabled:opacity-30">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
        </div>
      </div>

      <!-- Slider Container -->
      <div 
        id="suggested-albums-list" 
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

export async function initSuggestedAlbumsLogic() {
  const container = document.getElementById('suggested-albums-list');
  const btnPrev = document.getElementById('btn-prev-albums');
  const btnNext = document.getElementById('btn-next-albums');

  if (!container) return;

  try {
    // 1. Gọi API
    const response = await fetch('https://youtube-music.f8team.dev/api/home/albums-for-you');
    const data = await response.json();
    
    // Xử lý data (nếu trả về mảng trực tiếp hoặc data.data)
    const items = Array.isArray(data) ? data : (data.data || []);

    // 2. Render HTML
    if (items.length > 0) {
      const html = items.map(item => {
        const title = item.title;
      
        const artists = item.artists?.map(a => a.name).join(', ') || 'Nghệ sĩ';
     
        
//href="/albums/details/" 
        return `
          <a href="/albums/details/${item.slug}" class="w-[180px] md:w-[200px] shrink-0 cursor-pointer group flex flex-col">
            <!-- Image Container -->
            <div class="relative w-full aspect-square rounded-md overflow-hidden mb-3">
              <img src="${ item.thumbnails}" alt="${title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
              
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
    } else {
      container.innerHTML = '<p class="text-gray-500">Không có album nào</p>';
    }

  } catch (error) {
    console.error('Lỗi tải Suggested Albums:', error);
    container.innerHTML = '';
  }

  // --- Logic Scroll (Xử lý riêng cho slider này) ---
  const handleScroll = () => {
    // Hiện/Ẩn nút Prev
    if (container.scrollLeft > 20) {
      btnPrev.classList.remove('hidden');
      btnPrev.classList.add('flex');
    } else {
      btnPrev.classList.add('hidden');
      btnPrev.classList.remove('flex');
    }

    // Disable nút Next nếu hết đường cuộn
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (Math.ceil(container.scrollLeft) >= maxScroll - 10) {
        btnNext.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        btnNext.classList.remove('opacity-50', 'cursor-not-allowed');
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