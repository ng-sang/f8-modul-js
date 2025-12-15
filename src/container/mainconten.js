import { js_mods } from "./js_mods";
import { Quick_picks } from "./Quick_Picks";

export function mainconten() {
    return `<main id="main-content" class="  pt-16 ml-0 w-[92%] min-h-screen bg-[#0b0d0b] text-white  flex-grow-[1]">
      ${js_mods()}
      ${Quick_picks()}
      </main>`
}