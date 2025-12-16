import './style.css'; // Import Tailwind directives
import { renderHeader } from './components/header';
import { initRouter } from './router';

// 1. Render Header (Tĩnh)
document.querySelector('#header-container').innerHTML = renderHeader();

// 2. Khởi động Router (sẽ tự render Sidebar và Content)
initRouter();


