import { getUser } from '../../api.js';

export function renderWelcome() {
  const user = getUser();

  // Nếu chưa đăng nhập -> Không hiện gì cả
  if (!user) return '';

  // Lấy tên hiển thị (ưu tiên name, nếu không có thì lấy email)
  const displayName = user.name || user.email || 'bạn';

  return `
    <div class="flex items-center gap-4 mb-8 px-2 animate-fade-in">
        <span class="text-3xl md:text-5xl">👋</span>
        <h1 class="text-3xl md:text-5xl font-bold text-white">
            Chào mừng ${displayName}
        </h1>
    </div>
  `;
}