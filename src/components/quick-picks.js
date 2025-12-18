

export function renderQuickPicks() {
  return `
    <div class="w-full mb-10">
      <!-- Header: Title + Navigation Buttons -->
      <div class="flex items-center justify-between mb-4">
        <div>
           <span class="text-xs font-bold tracking-wider text-[#aaa] uppercase">Bắt đầu radio từ bài hát</span>
           <h2 class="text-3xl font-bold text-white mt-1">Quick Picks</h2>
        </div>
        
        <div class="flex gap-2">
           <button class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button class="w-8 h-8 rounded-full bg-transparent border border-[#ffffff1a] hover:bg-[#ffffff1a] flex items-center justify-center transition">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
        </div>
      </div>

      <!-- Grid Container: Chứa các item -->
      <!-- Sử dụng Grid để chia cột: Mobile 1 cột, Tablet 2 cột, Desktop 3 cột -->
      <div 
        id="quick-picks-list" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2"
      >
        <!-- Skeleton Loading (Hiệu ứng chờ) -->
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => `
          <div class="flex items-center gap-3 p-2 rounded-md">
            <div class="w-12 h-12 bg-[#ffffff1a] rounded animate-pulse shrink-0"></div>
            <div class="flex-1 space-y-2">
               <div class="h-4 w-3/4 bg-[#ffffff1a] rounded animate-pulse"></div>
               <div class="h-3 w-1/2 bg-[#ffffff1a] rounded animate-pulse"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export async function initQuickPicksLogic() {
  const container = document.getElementById('quick-picks-list');
  if (!container) return;

  try {

    const response = await fetch('https://youtube-music.f8team.dev/api/quick-picks');
    const data = await response.json();
    
  

    const items = Array.isArray(data) ? data : (data.data || []);

    // 2. Render Items
    if (items.length > 0) {
      const html = items.map(item => {
        // Lấy thông tin từ object item
        const title = item.title;
       
        
        // Xử lý nghệ sĩ: nối tên các nghệ sĩ bằng dấu phẩy
        const artists = item.artists?.map(a => a.name).join(', ') || 'Various Artists';
       
        // Nếu API có field viewCount thì thay vào: item.viewCount
        const views = Math.floor(Math.random() * 500) + ' lượt nghe'; 

        return `
          <a href="/playlists/details/${item.slug}" class="group flex items-center gap-4 p-2 rounded-md hover:bg-[#ffffff1a] cursor-pointer transition duration-200">
            <!-- Thumbnail Image -->
            <div class="relative w-12 h-12 shrink-0 overflow-hidden rounded">
              <img src="${item.thumbnails}" alt="${title}" class="w-full h-full object-cover">
              <!-- Overlay play icon khi hover -->
              <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                 <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>

            <!-- Info -->
            <div class="flex flex-col overflow-hidden">
              <h3 class="text-white font-medium text-[15px] truncate" title="${title}">${title}</h3>
              <p class="text-[#909090] text-[13px] truncate">
                ${artists} • ${views}
              </p>
            </div>
            
            <!-- Option Icon (hiện khi hover) -->
             <div class="ml-auto opacity-0 group-hover:opacity-100 transition">
                <button class="p-1 hover:bg-[#ffffff1a] rounded-full">
                   <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                </button>
             </div>
          </a>
        `;
      }).join('');
      
      container.innerHTML = html;
      
    } else {
      container.innerHTML = '<p class="text-gray-500 col-span-3">Không có nội dung</p>';
    }

  } catch (error) {
    console.error('Lỗi tải Quick Picks:', error);
    container.innerHTML = '';
  }
}

