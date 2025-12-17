// src/main.js

import './style.css'; 
import { renderHeader } from './components/header';
import { initRouter } from './router';
import { logout } from './api.js'; // Import hàm logout

// Hàm render header và gắn sự kiện logout
function updateHeader() {
    const headerContainer = document.querySelector('#header-container');
    headerContainer.innerHTML = renderHeader();

    // Gắn sự kiện click cho nút logout (nếu tồn tại)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if(confirm('Bạn có chắc muốn đăng xuất?')) {
                logout();
            }
        });
    }
}

// 1. Render Header lần đầu
updateHeader();

// 2. Lắng nghe sự kiện login/logout để render lại header
window.addEventListener('auth-change', () => {
    updateHeader();
});

// 3. Khởi động Router
initRouter();