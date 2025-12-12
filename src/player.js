export const Player = () => {
    return `
      <div class="fixed bottom-0 left-0 w-full h-20 bg-[#212121] border-t border-[#333] flex items-center justify-between px-4 z-50">
          <!-- Info -->
          <div class="flex items-center gap-4 w-[30%]">
              <div class="w-12 h-12 bg-gray-700 rounded overflow-hidden relative group">
                <svg class="w-6 h-6 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              </div>
              <div class="overflow-hidden">
                  <h4 class="text-white text-sm font-bold truncate">Chọn bài hát để nghe</h4>
              </div>
          </div>
  
          <!-- Controls -->
          <div class="flex flex-col items-center w-[40%] gap-1">
              <div class="flex items-center gap-6 text-gray-200">
                  <button class="hover:text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
                  <button id="btn-play" class="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition">
                      <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <button class="hover:text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
              </div>
              <div class="w-full max-w-md flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <span>0:00</span>
                  <div class="h-1 bg-gray-600 rounded-full flex-1 relative group cursor-pointer">
                      <div class="absolute h-full bg-white w-0 rounded-full group-hover:bg-red-500"></div>
                  </div>
                  <span>0:00</span>
              </div>
          </div>
  
          <!-- Volume -->
          <div class="flex items-center justify-end gap-3 w-[30%] text-gray-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              <div class="w-24 h-1 bg-gray-600 rounded-full cursor-pointer relative">
                   <div class="absolute h-full bg-white w-2/3 rounded-full hover:bg-red-500"></div>
              </div>
          </div>
      </div>
    `;
};