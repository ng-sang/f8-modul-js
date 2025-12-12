export const LoginModal = () => {
    return `
      <div id="login-modal" class="fixed inset-0 bg-black/80 z-[60] hidden flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm">
          <div class="bg-[#212121] w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden border border-gray-700">
              <div class="px-8 pt-8 pb-4">
                  <h2 class="text-3xl font-bold text-white mb-2">Đăng nhập</h2>
                  <p class="text-gray-400 text-sm">Tài khoản F8 Music</p>
              </div>
  
              <form id="login-form" class="px-8 pb-8 space-y-5">
                  <div class="space-y-1">
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                      <input type="email" id="email" required 
                          class="w-full bg-[#030303] text-white border border-gray-600 rounded-lg p-3 focus:border-white focus:outline-none"
                          placeholder="name@example.com" value="admin@gmail.com">
                  </div>
                  <div class="space-y-1">
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
                      <input type="password" id="password" required 
                          class="w-full bg-[#030303] text-white border border-gray-600 rounded-lg p-3 focus:border-white focus:outline-none"
                          placeholder="••••••••" value="123456">
                  </div>
                  <div id="error-msg" class="text-red-500 text-sm hidden bg-red-500/10 p-2 rounded"></div>
                  <button type="submit" id="btn-submit" class="w-full bg-white text-black font-bold py-3.5 rounded-full hover:bg-gray-200 transition">
                      Đăng nhập
                  </button>
              </form>
              <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
          </div>
      </div>
    `;
};