
import { register } from '../api.js';

export function renderRegister() {
  return `
    <div class="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div class="bg-[#212121] p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <h2 class="text-3xl font-bold text-center mb-6">Đăng ký</h2>
        
        <form id="register-form" class="flex flex-col gap-4">
           <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Tên hiển thị</label>
            <input type="text" id="reg-name" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="Your Name">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" id="reg-email" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="name@example.com">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
            <input type="password" id="reg-password" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="••••••••">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Nhập lại mật khẩu</label>
            <input type="password" id="reg-confirm" required 
              class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"
              placeholder="••••••••">
          </div>

          <div id="register-error" class="text-red-500 text-sm hidden text-center"></div>

          <button type="submit" 
            class="mt-2 w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">
            Đăng ký
          </button>
        </form>

        <p class="mt-6 text-center text-gray-400 text-sm">
          Đã có tài khoản? 
          <a href="#/login" class="text-white font-medium hover:underline">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  `;
}

export function initRegisterLogic() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        const errorDiv = document.getElementById('register-error');

        // Validate cơ bản
        if (password !== confirmPassword) {
            errorDiv.innerText = "Mật khẩu xác nhận không khớp!";
            errorDiv.classList.remove('hidden');
            return;
        }

        // Reset lỗi
        errorDiv.classList.add('hidden');
        errorDiv.innerText = '';

        const btn = form.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = 'Đang đăng ký...';
        btn.disabled = true;

        const result = await register(name, email, password, confirmPassword);

        if (result.success) {
            alert("Đăng ký thành công!");
            window.location.hash = '/';
        } else {
            errorDiv.innerText = result.message;
            errorDiv.classList.remove('hidden');
        }

        btn.innerText = oldText;
        btn.disabled = false;
    });
}