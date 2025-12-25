// src/main.js

import './style.css'; 
import { renderHeader, initHeaderLogic } from './components/header.js';
import { initRouter } from './router.js';
import { renderSidebar } from './components/sidebar.js'; 
// --- QUAN TRỌNG: Import hàm renderWelcome để vẽ lại khi logout ---
import { renderWelcome } from './components/home/welcome.js'; 

function updateHeader() {
    const headerContainer = document.querySelector('#header-container');
    if (headerContainer) {
        headerContainer.innerHTML = renderHeader();
        initHeaderLogic();
    }
}

// Render Header lần đầu
updateHeader();

// Lắng nghe sự kiện login/logout
window.addEventListener('auth-change', () => {
    // 1. Cập nhật Header
    updateHeader();

    // 2. Cập nhật Lời chào (nếu ở trang chủ)
    const welcomeWrapper = document.getElementById('welcome-wrapper');
    if (welcomeWrapper) {
        welcomeWrapper.innerHTML = renderWelcome();
    }

    // --- 3. FIX LỖI: CẬP NHẬT SIDEBAR ---
    const sidebarContainer = document.querySelector('#sidebar-container');
    if (sidebarContainer) {
        // Lấy đường dẫn hiện tại (bỏ dấu #) để giữ trạng thái active cho menu
        const currentPath = window.location.hash.replace('#', '') || '/';
        
        // Vẽ lại sidebar (Lúc này hàm getUser() sẽ trả về null -> Nút đăng nhập sẽ hiện ra)
        sidebarContainer.innerHTML = renderSidebar(currentPath);
    }
    // ------------------------------------
});

initRouter();