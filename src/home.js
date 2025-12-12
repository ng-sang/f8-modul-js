// src/home.js
import { getCategories, getLines, getSongsByLine } from "./api";

export const HomePage = async () => {
    try {
        // 1. Gọi song song 2 API để tiết kiệm thời gian
        const [categoriesRes, linesRes] = await Promise.all([
            getCategories(),
            getLines()
        ]);

        // Kiểm tra dữ liệu
        const categories = categoriesRes?.items || [];
        const lines = linesRes?.items || [];

        // 2. Nếu có danh sách dòng nhạc, gọi thêm API lấy bài hát của dòng nhạc đầu tiên (để demo)
        let suggestedSongs = [];
        if (lines.length > 0) {
            const firstLineSlug = lines[0].slug; // Lấy slug của dòng nhạc đầu tiên
            const songsRes = await getSongsByLine(firstLineSlug);
            suggestedSongs = songsRes?.items || [];
        }

        // --- HÀM HELPER: VẼ CARD (Dùng chung) ---
        const createCard = (item, isCircle = false) => {
            // API trả về 'thumbnailUrl' (theo ảnh bạn gửi)
            const img = item.thumbnailUrl || item.thumb || "https://via.placeholder.com/300";
            const name = item.name || item.title || "Không tên";
            const desc = item.description || "";

            return `
                <div class="group cursor-pointer flex flex-col gap-3 p-3 rounded-lg hover:bg-[#1e1e1e] transition duration-300">
                    <div class="relative overflow-hidden ${isCircle ? 'rounded-full' : 'rounded-md'} aspect-square shadow-lg">
                        <img src="${img}" 
                             class="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out" 
                             loading="lazy">
                        
                        <!-- Nút Play (Chỉ hiện khi hover) -->
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                             ${!isCircle ? `
                            <button class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition shadow-xl pl-1">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </button>` : ''}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-white font-bold text-sm truncate hover:text-[#3ea6ff] transition text-center md:text-left">${name}</h4>
                        ${desc ? `<p class="text-gray-400 text-xs truncate mt-1 text-center md:text-left">${desc}</p>` : ''}
                    </div>
                </div>
            `;
        };

        // --- HÀM HELPER: VẼ LIST BÀI HÁT NGANG ---
        const createSongItem = (song) => {
            return `
                <div class="flex items-center justify-between p-2 hover:bg-white/10 rounded group cursor-pointer border-b border-white/5">
                    <div class="flex items-center gap-3">
                        <div class="relative w-10 h-10 rounded overflow-hidden">
                            <img src="${song.thumb || song.thumbnailUrl}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-white truncate w-40 sm:w-60">${song.name || song.title}</h4>
                            <p class="text-xs text-gray-400">Lượt xem: ${song.views || 0}</p>
                        </div>
                    </div>
                    <span class="text-xs text-gray-500 font-medium">3:45</span>
                </div>
            `;
        };

        // 3. Render HTML tổng hợp
        return `
            <!-- SECTION 1: TÂM TRẠNG & HOẠT ĐỘNG -->
            ${categories.length > 0 ? `
            <section class="mb-12">
                <div class="flex justify-between items-end mb-4 px-3">
                     <h3 class="text-2xl font-bold text-white tracking-tight">Tâm trạng & Hoạt động</h3>
                     <span class="text-xs font-bold text-gray-400 uppercase border border-gray-600 px-3 py-1 rounded-full cursor-pointer hover:border-white hover:text-white transition">Xem thêm</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${categories.slice(0, 5).map(item => createCard(item)).join("")}
                </div>
            </section>` : ''}

            <!-- SECTION 2: DÒNG NHẠC (LINES) -->
            ${lines.length > 0 ? `
            <section class="mb-12">
                <div class="flex justify-between items-end mb-4 px-3">
                     <div>
                        <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Khám phá</p>
                        <h3 class="text-2xl font-bold text-white tracking-tight">Dòng nhạc nổi bật</h3>
                     </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${lines.slice(0, 5).map(item => createCard(item)).join("")}
                </div>
            </section>` : ''}

            <!-- SECTION 3: BÀI HÁT GỢI Ý (Lấy từ dòng nhạc đầu tiên) -->
            ${suggestedSongs.length > 0 ? `
            <section class="mb-12">
                <h3 class="text-xl font-bold text-white mb-4 px-3">Gợi ý cho bạn</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                    ${suggestedSongs.slice(0, 9).map(song => createSongItem(song)).join("")}
                </div>
            </section>` : ''}
        `;

    } catch (error) {
        console.error("Lỗi Home:", error);
        return `<div class="text-red-400 p-5 text-center">Không thể tải dữ liệu. Vui lòng kiểm tra API.</div>`;
    }
};