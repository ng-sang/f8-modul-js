/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Dòng dưới rất quan trọng: thêm đuôi js vào để nó quét file header.js
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}