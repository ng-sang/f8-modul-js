
import { getUser, updateProfile, changePassword } from '../api.js';



// Icon Mắt (Hiện mật khẩu)
const iconEyeShow = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
// Icon Mắt gạch chéo (Ẩn mật khẩu) 
const iconEyeHide = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;


export function renderProfile() {
    const user = getUser();
    if (!user) return '<div class="text-white p-4">Vui lòng đăng nhập.</div>';
    return `
    <div class="flex items-center justify-center min-h-[calc(100vh-100px)] animate-fade-in">
      <div class="relative bg-[#212121] p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <a href="#/" class="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></a>
        <h2 class="text-2xl font-bold text-center mb-6 uppercase tracking-wide text-white">Cập nhật thông tin</h2>
        <form id="profile-form" class="flex flex-col gap-4">
          <div><label class="block text-sm font-medium text-gray-400 mb-1">Tên hiển thị</label><input type="text" id="up-name" value="${user.name || ''}" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"></div>
          <div><label class="block text-sm font-medium text-gray-400 mb-1">Email</label><input type="email" id="up-email" value="${user.email || ''}" required class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition"></div>
          <div id="profile-msg" class="text-sm hidden text-center font-medium mt-2"></div>
          <button type="submit" class="mt-4 w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">Cập nhật</button>
        </form>
      </div>
    </div>`;
}

export function initProfileLogic() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('up-name').value.trim();
        const email = document.getElementById('up-email').value.trim();
        const msgDiv = document.getElementById('profile-msg');
        const btn = form.querySelector('button');
        
        msgDiv.classList.add('hidden');
        btn.innerText = 'Đang lưu...'; btn.disabled = true;

        const res = await updateProfile(name, email);

        msgDiv.innerText = res.message;
        msgDiv.classList.remove('hidden', 'text-red-500', 'text-green-500');
        msgDiv.classList.add(res.success ? 'text-green-500' : 'text-red-500');
        btn.innerText = 'Cập nhật'; btn.disabled = false;
    });
}

// --- TRANG ĐỔI MẬT KHẨU ---
export function renderChangePassword() {
    // Helper tạo input có mắt và padding-right để không đè icon
    const renderPassInput = (id, label) => `
        <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">${label}</label>
            <div class="relative">
                <input type="password" id="${id}" required minlength="6" class="w-full bg-[#121212] border border-gray-600 rounded p-2.5 pr-10 text-white focus:border-white outline-none focus:ring-1 focus:ring-white transition" placeholder="••••••••">
                <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                    ${iconEyeShow}
                </button>
            </div>
        </div>`;

    return `
    <div class="flex items-center justify-center min-h-[calc(100vh-100px)] animate-fade-in">
      <div class="relative bg-[#212121] p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <a href="#/" class="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </a>
        <h2 class="text-2xl font-bold text-center mb-6 uppercase tracking-wide text-white">Đổi mật khẩu</h2>
        <form id="password-form" class="flex flex-col gap-4">
          ${renderPassInput('cp-current', 'Mật khẩu hiện tại')}
          ${renderPassInput('cp-new', 'Mật khẩu mới (Tối thiểu 6 ký tự)')}
          ${renderPassInput('cp-confirm', 'Xác nhận mật khẩu mới')}

          <div id="cp-msg" class="text-sm hidden text-center font-medium mt-2"></div>

          <button type="submit" class="mt-4 w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
    `;
}

export function initChangePasswordLogic() {
    const form = document.getElementById('password-form');
    if (!form) return;

    // --- LOGIC BẬT/TẮT MẮT ---
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
        const current = document.getElementById('cp-current').value.trim();
        const newVal = document.getElementById('cp-new').value.trim();
        const confirm = document.getElementById('cp-confirm').value.trim();
        const msgDiv = document.getElementById('cp-msg');
        const btn = form.querySelector('button[type="submit"]');

        if (newVal.length < 6) {
            msgDiv.innerText = "Mật khẩu mới phải có ít nhất 6 ký tự!";
            msgDiv.className = "text-sm text-center font-bold mt-2 text-red-500";
            msgDiv.classList.remove('hidden');
            return;
        }

        if (newVal !== confirm) {
            msgDiv.innerText = "Mật khẩu xác nhận không khớp!";
            msgDiv.className = "text-sm text-center font-bold mt-2 text-red-500";
            msgDiv.classList.remove('hidden');
            return;
        }

        msgDiv.classList.add('hidden');
        btn.innerText = 'Đang xử lý...';
        btn.disabled = true;

        const res = await changePassword(current, newVal, confirm);

        msgDiv.innerText = res.message;
        msgDiv.classList.remove('hidden');

        if (res.success) {
            msgDiv.className = "text-sm text-center font-bold mt-2 text-green-500";
            form.reset(); 
        } else {
            msgDiv.className = "text-sm text-center font-bold mt-2 text-red-500";
        }
        btn.innerText = 'Đổi mật khẩu';
        btn.disabled = false;
    });
}