const API_URL = "https://youtube-music.f8team.dev/api";

export const auth = {
  // Lấy token từ LocalStorage
  getToken() {
    return localStorage.getItem("access_token");
  },

  // Hàm gọi API chung (Wrapper)
  async client(endpoint, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Nếu lỗi 401 (Unauthorized) -> Token hết hạn -> Xóa token
        if (response.status === 401) {
          this.logoutLocal();
        }
        throw new Error(data.message || "Có lỗi xảy ra");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // --- CÁC CHỨC NĂNG CHÍNH ---

  async login(email, password) {
    const data = await this.client("/auth/login", "POST", { email, password });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data.user;
  },

  async register(name, email, password, confirmPassword) {
    const data = await this.client("/auth/register", "POST", {
      name,
      email,
      password,
      confirmPassword,
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data.user;
  },

  async getMe() {
    // Nếu không có token thì không gọi API
    if (!this.getToken()) return null;
    return await this.client("/auth/me", "GET");
  },

  async updateProfile(name, email) {
    return await this.client("/auth/me", "PATCH", { name, email });
  },

  async changePassword(oldPassword, password, confirmPassword) {
    return await this.client("/auth/change-password", "PATCH", {
      oldPassword,
      password,
      confirmPassword,
    });
  },

  async logout() {
    try {
      await this.client("/auth/logout", "DELETE");
    } catch (e) {
      console.log("Lỗi logout server, vẫn xóa local");
    } finally {
      this.logoutLocal();
    }
  },

  // Xóa token ở trình duyệt và reload trang
  logoutLocal() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.reload();
  }
};

// home_moods

export function home_moods(){
  async function albums_for_you() {
        const response =await fetch(`${API_URL}/moods`);
        const data =await response.json();       
        const moods = data.items;      
        const moodsContainer = document.querySelector(".js-moods");
    moodsContainer.innerHTML = moods
      .map(
        (mood) => ` <a href="/moods/${mood.slug}" data-navigo class="flex w-auto items-center px-3 py-2 rounded-lg text-sm shrink-0 cursor-pointer
        bg-white/10 text-white hover:bg-white/20
      ">${mood.name}</a>`
      )
      .join("");  
  }
  albums_for_you();
} 
export function quick_picks() {
   async function quick_picks1() {
      const response =await fetch(`${API_URL}/quick-picks`);
        const data =await response.json();
        const quickEL = document.querySelector(".quick123")
     quickEL.innerHTML=  data.map((data1)=> `<a class="flex items-center gap-4 py-2 px-3 hover:bg-white/5 rounded-lg transition cursor-pointer group">${data1.slug.replaceAll("-"," ")}</a>` ).join("") ;  
   }
   quick_picks1()
}