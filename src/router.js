
import Navigo from "navigo";

import { mainconten } from "./container/mainconten";


export default function router() {
  const router = new Navigo("/");
  router
    .on("/", () => {
      // Render HTML
      document.querySelector("#main-content").innerHTML = `${mainconten()}`;
    })
    .on("/explore", () => {
      document.querySelector("#main-content").innerHTML = `đang chờ thực thi`;
    })
    .on("/moods/:slug", ({ data }) => {
    
      
      
    });
  router.resolve();
}