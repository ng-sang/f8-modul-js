// src/components/moods.js

// 1. Hàm trả về khung HTML tĩnh
export function renderMoodsContainer() {
  return `
    <div class="relative w-full mb-8 group" id="mood-section">
      <!-- Container chứa danh sách Moods -->
      <div 
        id="mood-list" 
        class="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar w-full pr-[100px] items-center"
      >
        <!-- Skeleton Loading (Hiệu ứng khi đang tải) -->
        ${[1, 2, 3, 4, 5].map(() => `
          <div class="h-[32px] w-24 bg-[#ffffff1a] rounded-lg animate-pulse shrink-0"></div>
        `).join('')}
      </div>

      <!-- Nút điều hướng (Hiện ở góc phải) -->
      <div class="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-yt-black via-yt-black/80 to-transparent pl-4">
        <button id="btn-prev" class="hidden w-8 h-8 rounded-full bg-[#212121] hover:bg-[#333] items-center justify-center mr-2 transition">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button id="btn-next" class="w-8 h-8 rounded-full bg-[#212121] hover:bg-[#333] flex items-center justify-center transition">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  `;
}

// 2. Hàm Logic: Gọi API và gắn sự kiện
export async function initMoodsLogic() {
  const moodList = document.getElementById('mood-list');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (!moodList) return;
  try {
    const response = await fetch('https://youtube-music.f8team.dev/api/moods');
    const data = await response.json();
    const moods = data.items;
    if (moods.length > 0) {
      const html = moods.map(mood => `
        <button 
          class="shrink-0 px-4 py-2 bg-[#ffffff1a] hover:bg-[#ffffff33] rounded-lg text-sm font-medium text-white transition whitespace-nowrap border border-transparent hover:border-[#ffffff1a]"
        >
         ${mood.name}
        </button>
      `).join('');
      
      moodList.innerHTML = html;
    } else {
      moodList.innerHTML = '<p class="text-sm text-gray-500">Không có dữ liệu</p>';
    }

  } catch (error) {
    console.error('Lỗi tải Moods:', error);
    moodList.innerHTML = ''; // Ẩn loading nếu lỗi
  }

  // --- XỬ LÝ SCROLL BUTTONS ---
  const handleScroll = () => {
    // Hiển thị/Ẩn nút Prev
    if (moodList.scrollLeft > 0) {
      btnPrev.classList.remove('hidden');
      btnPrev.classList.add('flex');
    } else {
      btnPrev.classList.add('hidden');
      btnPrev.classList.remove('flex');
    }
  };

  moodList.addEventListener('scroll', handleScroll);

  btnNext.addEventListener('click', () => {
    moodList.scrollBy({ left: 300, behavior: 'smooth' });
  });

  btnPrev.addEventListener('click', () => {
    moodList.scrollBy({ left: -300, behavior: 'smooth' });
  });
}