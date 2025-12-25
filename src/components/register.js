import { register } from '../api.js';

// Icon Mắt (Hiện mật khẩu)
const iconEyeShow = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
// Icon Mắt gạch chéo (Ẩn mật khẩu) 
const iconEyeHide = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;

export function renderRegister() {
  return `
    <div class="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div class="relative bg-[#212121] p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <a href="#/" class="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </a>
        <h2 class="text-3xl font-bold text-center mb-6">Đăng ký</h2>
        <form id="register-form" class="flex flex-col gap-4">
           <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Tên hiển thị</label>
            <input type="text" id="reg-name" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition" placeholder="Your Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" id="reg-email" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition" placeholder="name@example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
            <div class="relative">
                <input type="password" id="reg-password" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 pr-10 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition" placeholder="••••••••">
                <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                    ${iconEyeShow}
                </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Nhập lại mật khẩu</label>
             <div class="relative">
                <input type="password" id="reg-confirm" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 pr-10 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition" placeholder="••••••••">
                <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                    ${iconEyeShow}
                </button>
            </div>
          </div>
          <div id="register-error" class="text-red-500 text-sm hidden text-center"></div>
          <button type="submit" class="mt-2 w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">Đăng ký</button>
        </form>
        <p class="mt-6 text-center text-gray-400 text-sm">Đã có tài khoản? <a href="#/login" class="text-white font-medium hover:underline">Đăng nhập ngay</a></p>
      </div>
    </div>`;
}

export function initRegisterLogic() {
    const form = document.getElementById('register-form');
    if (!form) return;

    // Logic đổi icon
    form.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = iconEyeHide;
            } else {
                input.type = 'password';
                btn.innerHTML = iconEyeShow;
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        const errorDiv = document.getElementById('register-error');
        const btn = form.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            errorDiv.innerText = "Mật khẩu xác nhận không khớp!";
            errorDiv.classList.remove('hidden');
            return;
        }

        errorDiv.classList.add('hidden');
        const oldText = btn.innerText;
        btn.innerText = 'Đang đăng ký...';
        btn.disabled = true;

        const result = await register(name, email, password, confirmPassword);

        if (result.success) {
            window.location.hash = '/';
        } else {
            errorDiv.innerText = result.message;
            errorDiv.classList.remove('hidden');
        }
        btn.innerText = oldText;
        btn.disabled = false;
    });
}