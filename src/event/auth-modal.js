export const AuthModal = () => {
  return `
    <div id="auth-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div class="w-full max-w-md rounded-xl bg-[#212121] p-8 shadow-2xl border border-white/10">
        
        <h2 id="modal-title" class="mb-6 text-center text-2xl font-bold text-white">Đăng nhập</h2>
        
        <form id="auth-form" class="flex flex-col gap-4">
          <!-- Tên (Chỉ hiện khi đăng ký) -->
          <input id="inp-name" type="text" placeholder="Họ và tên" class="hidden rounded bg-[#121212] p-3 text-white outline-none focus:ring-1 focus:ring-white/50" />
          
          <input id="inp-email" type="email" placeholder="Email" class="rounded bg-[#121212] p-3 text-white outline-none focus:ring-1 focus:ring-white/50" required />
          <input id="inp-password" type="password" placeholder="Mật khẩu" class="rounded bg-[#121212] p-3 text-white outline-none focus:ring-1 focus:ring-white/50" required />
          
          <!-- Confirm Pass (Chỉ hiện khi đăng ký) -->
          <input id="inp-confirm" type="password" placeholder="Nhập lại mật khẩu" class="hidden rounded bg-[#121212] p-3 text-white outline-none focus:ring-1 focus:ring-white/50" />

          <button type="submit" class="mt-2 rounded-full bg-white py-3 font-bold text-black hover:bg-gray-200 transition">
            <span id="btn-submit-text">Đăng nhập</span>
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-400">
          <span id="auth-switch-text">Chưa có tài khoản?</span>
          <button id="btn-switch-mode" class="ml-1 font-bold text-white hover:underline">Đăng ký ngay</button>
        </p>
        
        <button id="btn-close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `;
};