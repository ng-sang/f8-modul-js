import './style.css';
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Player } from "./player";
import { LoginModal } from "./login-modal";
import { HomePage } from "./home";
import { loginUser } from "./api"; 

const appEL = document.querySelector("#app");

// Lấy user từ localStorage
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem("user_info"));
} catch (e) { currentUser = null; }

const renderApp = async () => {
    // 1. Render khung giao diện (Skeleton)
    appEL.innerHTML = `
        ${Header(currentUser)}
        
        <div class="flex pt-16 h-screen bg-[#030303]">
            ${Sidebar()}
            
            <!-- MAIN CONTENT: Nơi chứa danh sách nhạc -->
            <main class="flex-1 md:ml-64 p-4 md:p-8 pb-32 overflow-y-auto w-full custom-scrollbar scroll-smooth" id="main-content">
                <!-- Hiệu ứng Loading đẹp -->
                <div class="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#333] border-t-red-600"></div>
                    <p class="text-gray-400 text-sm font-medium animate-pulse">Đang tải danh sách nhạc...</p>
                </div>
            </main>
        </div>

        ${Player()}
        ${LoginModal()}
    `;

    // 2. Gọi API lấy dữ liệu nhạc
    const homeHTML = await HomePage();
    
    // 3. Đổ dữ liệu vào Main Content
    const mainContent = document.querySelector("#main-content");
    if (mainContent) {
        // Tạo câu chào mừng
        let greeting = "";
        const hour = new Date().getHours();
        if (hour < 12) greeting = "Chào buổi sáng";
        else if (hour < 18) greeting = "Chào buổi chiều";
        else greeting = "Chào buổi tối";

        const userDisplay = currentUser 
            ? `<h2 class="text-4xl font-bold mb-2">${greeting}, ${currentUser.name}</h2>` 
            : `<h2 class="text-4xl font-bold mb-2">${greeting}</h2>`;

        // Render HTML
        mainContent.innerHTML = `
            <div class="max-w-[1600px] mx-auto">
                <div class="mb-10 mt-4 px-3">
                    ${userDisplay}
                    <p class="text-gray-400 font-medium">Thư giãn với những bản nhạc tuyển chọn dành riêng cho bạn.</p>
                </div>
                
                <!-- DANH SÁCH NHẠC TỪ API -->
                ${homeHTML}

                <!-- Footer nhỏ cuối trang -->
                <div class="mt-20 pt-10 border-t border-[#222] text-center text-gray-500 text-sm pb-10">
                    <p>&copy; 2025 Clone Music Player. Code by You.</p>
                </div>
            </div>
        `;
    }

    // 4. Gắn sự kiện (Login, Modal...)
    attachEvents();
}

const attachEvents = () => {
    const btnLogin = document.querySelector("#btn-login");
    const modal = document.querySelector("#login-modal");
    const closeModal = document.querySelector("#close-modal");
    const loginForm = document.querySelector("#login-form");
    const errorMsg = document.querySelector("#error-msg");
    const btnSubmit = document.querySelector("#btn-submit");

    if (btnLogin && modal) btnLogin.addEventListener("click", () => modal.classList.remove("hidden"));
    if (closeModal && modal) {
        closeModal.addEventListener("click", () => {
            modal.classList.add("hidden");
            if(errorMsg) errorMsg.classList.add("hidden");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            btnSubmit.innerHTML = `<svg class="animate-spin h-5 w-5 text-black mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            btnSubmit.disabled = true;

            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            try {
                const res = await loginUser({ email, password });
                if (res && (res.status === "success" || res.data)) {
                     const userData = res.data.user || res.data;
                     localStorage.setItem("user_info", JSON.stringify(userData));
                     currentUser = userData;
                     renderApp(); 
                } else {
                     throw new Error("Thông tin đăng nhập không đúng");
                }
            } catch (err) {
                if(errorMsg) {
                    errorMsg.textContent = err.message || "Lỗi kết nối";
                    errorMsg.classList.remove("hidden");
                }
                btnSubmit.innerHTML = "Đăng nhập";
                btnSubmit.disabled = false;
            }
        });
    }
}

renderApp();