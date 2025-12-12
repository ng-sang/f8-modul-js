// src/api.js
const API_BASE = "https://youtube-music.f8team.dev/api";

const fetchAPI = async (endpoint, method = "GET", body = null) => {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Nếu API trả về lỗi
    if (!response.ok) {
        console.error(`Lỗi API ${endpoint}:`, response.status);
        return null;
    }
    return response.json();
};

// 1. Lấy danh sách Tâm trạng (Mood)
export const getCategories = () => fetchAPI("/categories");

// 2. Lấy danh sách Dòng nhạc (Lines)
export const getLines = () => fetchAPI("/lines");

// 3. Lấy bài hát của một dòng nhạc cụ thể (để hiển thị list nhạc gợi ý)
// Ví dụ slug = 'nh-c-viet'
export const getSongsByLine = (slug) => fetchAPI(`/lines/${slug}/songs?limit=10`);

// 4. Đăng nhập
export const loginUser = (data) => fetchAPI("/auth/login", "POST", data);