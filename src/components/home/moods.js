import { API_BASE_URL } from '../../config.js';

export function renderMoodsContainer() {
  return `
    <div class="relative w-full mb-8 group" id="mood-section">
      <div id="mood-list" class="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar w-full pr-[100px] items-center">
        ${[1, 2, 3, 4, 5].map(() => `<div class="h-[32px] w-24 bg-[#ffffff1a] rounded-lg animate-pulse shrink-0"></div>`).join('')}
      </div>
      <div class="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-yt-black via-yt-black/80 to-transparent pl-4">
        <button id="btn-prev-moods-main" class="hidden w-8 h-8 rounded-full bg-[#212121] hover:bg-[#333] items-center justify-center mr-2 transition"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
        <button id="btn-next-moods-main" class="w-8 h-8 rounded-full bg-[#212121] hover:bg-[#333] flex items-center justify-center transition"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
      </div>
    </div>
  `;
}

export async function initMoodsLogic() {
  const moodList = document.getElementById('mood-list');
  const btnPrev = document.getElementById('btn-prev-moods-main');
  const btnNext = document.getElementById('btn-next-moods-main');
  
  if (!moodList) return;

  try {
    const response = await fetch(`${API_BASE_URL}/moods`);
    const data = await response.json();
   
      moodList.innerHTML = data.items.map(mood => `
        <a href="/moods/${mood.slug}" class="shrink-0 px-4 py-2 bg-[#ffffff1a] hover:bg-[#ffffff33] rounded-lg text-sm font-medium text-white transition whitespace-nowrap border border-transparent hover:border-[#ffffff1a] cursor-pointer">
         ${mood.name}
        </a>`).join('');
   
  } catch (error) { moodList.innerHTML = ''; }

  const handleScroll = () => {
    if (moodList.scrollLeft > 0) { btnPrev.classList.remove('hidden'); btnPrev.classList.add('flex'); }
    else { btnPrev.classList.add('hidden'); btnPrev.classList.remove('flex'); }
  };

  moodList.addEventListener('scroll', handleScroll);
  btnNext.addEventListener('click', () => moodList.scrollBy({ left: 300, behavior: 'smooth' }));
  btnPrev.addEventListener('click', () => moodList.scrollBy({ left: -300, behavior: 'smooth' }));
}