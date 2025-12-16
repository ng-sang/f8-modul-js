/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          black: '#030303',
          hover: '#2a2a2a',
          sidebar: '#030303',
          search: '#212121',
          active: '#282828' // Màu xám đậm cho nút Trang chủ
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}