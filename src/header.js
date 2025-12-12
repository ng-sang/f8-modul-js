export const Header = (user) => {
    // UI khi đã đăng nhập
    const userLoggedIn = `
        <div class="flex items-center gap-2 cursor-pointer">
            <img src="${user?.avatar || 'https://ui-avatars.com/api/?background=random&color=fff'}" 
                 class="w-8 h-8 rounded-full border border-gray-600 object-cover">
        </div>
    `;

    // UI khi chưa đăng nhập
    const userLoggedOut = `
        <button id="btn-login" class="bg-white text-black px-4 py-1.5 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
            Đăng nhập
        </button>
    `;

    return `
    <header class="bg-[#030303] text-white h-16 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50 border-b border-[#222]">
        <div class="flex items-center gap-4">
             <button class="p-2 hover:bg-[#222] rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
             <a href="/" class="flex items-center gap-1 font-bold text-xl tracking-tighter">
                <div class="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>
                Music
             </a>
        </div>

        <div class="hidden md:flex flex-1 max-w-xl mx-4">
            <div class="w-full relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" placeholder="Tìm kiếm bài hát, nghệ sĩ..." class="w-full bg-[#222] border border-[#333] rounded-lg py-2 pl-10 pr-4 focus:bg-white focus:text-black focus:border-white outline-none transition-colors text-sm font-medium">
            </div>
        </div>

        <div class="flex items-center gap-3">
             ${user ? userLoggedIn : userLoggedOut}
        </div>
    </header>
    `;
};