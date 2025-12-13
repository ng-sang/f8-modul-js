
export const initEvents = () => {
  
  const loginBtn = document.querySelector("#login-btn");
 


    loginBtn.addEventListener("click", () => {
        console.log("sang");
        alert("Đã click được: sang");
    })
};