// src/main.js
import './style.css';
import { Header } from './header.js';
import { Sidebar } from './sidebar/sidebar.js';
import { AuthModal } from './event/auth-modal.js';
import { auth, home_moods, quick_picks } from './api.js';
import {mainconten } from './container/mainconten.js';
import router from "./router";

const app = document.querySelector('#app');

// --- HÀM KHỞI TẠO ỨNG DỤNG ---
async function initApp() {
  // 1. Lấy thông tin User nếu đã có token
  let currentUser = null;
  try {
    currentUser = await auth.getMe();
  } catch (err) {
    console.log("Token không hợp lệ hoặc hết hạn");
  }

  // 2. Render Giao diện
  app.innerHTML = `
    ${Header(currentUser)}
    <div class="w-full flex ">
      ${Sidebar()}
      ${mainconten()}
   </div>

   
    ${AuthModal()} 
  `;router();
 
  // 3. GẮN SỰ KIỆN (EVENT LISTENERS)
  handleAuthEvents(currentUser);
}

// --- XỬ LÝ SỰ KIỆN LIÊN QUAN ĐẾN AUTH ---
function handleAuthEvents(user) {
  const modal = document.getElementById('auth-modal');
  const form = document.getElementById('auth-form');
  const title = document.getElementById('modal-title');
  const btnSwitch = document.getElementById('btn-switch-mode');
  const switchText = document.getElementById('auth-switch-text');
  const submitText = document.getElementById('btn-submit-text');
  
  // Input fields
  const inpName = document.getElementById('inp-name');
  const inpEmail = document.getElementById('inp-email');
  const inpPass = document.getElementById('inp-password');
  const inpConfirm = document.getElementById('inp-confirm');

  let isLoginMode = true;

  // MỞ MODAL ĐĂNG NHẬP
  const btnLoginPopup = document.getElementById('btn-login-popup');
  if (btnLoginPopup) {
    btnLoginPopup.onclick = () => {
      modal.classList.remove('hidden');
    };
  }

  // ĐÓNG MODAL
  document.getElementById('btn-close-modal').onclick = () => {
    modal.classList.add('hidden');
  };

  // CHUYỂN ĐỔI LOGIN <-> REGISTER
  btnSwitch.onclick = () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
      // Chế độ Login
      title.innerText = "Đăng nhập";
      submitText.innerText = "Đăng nhập";
      switchText.innerText = "Chưa có tài khoản?";
      btnSwitch.innerText = "Đăng ký ngay";
      inpName.classList.add('hidden');
      inpConfirm.classList.add('hidden');
    } else {
      // Chế độ Register
      title.innerText = "Đăng ký";
      submitText.innerText = "Đăng ký";
      switchText.innerText = "Đã có tài khoản?";
      btnSwitch.innerText = "Đăng nhập";
      inpName.classList.remove('hidden');
      inpConfirm.classList.remove('hidden');
    }
  };

  // XỬ LÝ SUBMIT FORM
  form.onsubmit = async (e) => {
    e.preventDefault();
    submitText.innerText = "Đang xử lý...";
    
    try {
      if (isLoginMode) {
        // Gọi API Login
        await auth.login(inpEmail.value, inpPass.value);
        alert("Đăng nhập thành công!");
        window.location.reload(); // Reload để cập nhật giao diện
      } else {
        // Gọi API Register
        if (inpPass.value !== inpConfirm.value) {
          alert("Mật khẩu nhập lại không khớp!");
          submitText.innerText = "Đăng ký";
          return;
        }
        await auth.register(inpName.value, inpEmail.value, inpPass.value, inpConfirm.value);
        alert("Đăng ký thành công!");
        window.location.reload();
      }
    } catch (error) {
      alert(error.message);
      submitText.innerText = isLoginMode ? "Đăng nhập" : "Đăng ký";
    }
  };

  // XỬ LÝ ĐĂNG XUẤT
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.onclick = async () => {
      if(confirm("Bạn có chắc muốn đăng xuất?")) {
        await auth.logout();
      }
    };
  }

  // XỬ LÝ SỬA PROFILE (Cơ bản - dùng prompt cho nhanh)
  const btnEdit = document.getElementById('btn-edit-profile');
  if (btnEdit && user) {
    btnEdit.onclick = async () => {
      const newName = prompt("Nhập tên mới:", user.name);
      if (newName && newName !== user.name) {
        try {
          await auth.updateProfile(newName, user.email);
          alert("Cập nhật tên thành công!");
          window.location.reload();
        } catch (err) {
          alert(err.message);
        }
      }
    };
  }
}
  

// CHẠY ỨNG DỤNG
initApp();
home_moods();
quick_picks();
