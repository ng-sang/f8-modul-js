
import { login } from '../api.js';

export function renderLogin() {
  return `
    <div class="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div class="bg-[#212121] p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <h2 class="text-3xl font-bold text-center mb-6">Đăng nhập</h2>
        
        <form id="login-form" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" id="email" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="name@example.com">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
            <input type="password" id="password" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="••••••••">
          </div>

          <div id="login-error" class="text-red-500 text-sm hidden text-center"></div>

          <button type="submit" 
            class="mt-2 w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">
            Đăng nhập
          </button>
        </form>

        <p class="mt-6 text-center text-gray-400 text-sm">
          Chưa có tài khoản? 
          <a href="#/register" class="text-white font-medium hover:underline">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  `;
}

export function initLoginLogic() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        // Reset lỗi
        errorDiv.classList.add('hidden');
        errorDiv.innerText = '';

        const btn = form.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = 'Đang xử lý...';
        btn.disabled = true;

        const result = await login(email, password);

        if (result.success) {
            alert(`Chào mừng ${result.user.name} quay trở lại!`);
            window.location.hash = '/'; // Chuyển về trang chủ
        } else {
            errorDiv.innerText = result.message;
            errorDiv.classList.remove('hidden');
        }

        btn.innerText = oldText;
        btn.disabled = false;
    });
}