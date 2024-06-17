
const msgError = document.querySelector(".msgError");

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await login();
    } catch (error) {
        msgError.textContent = "An unexpected error occurred";
        console.error("Unexpected error:", error);
    }
});

async function login() {
    try {
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Email or Password incorrect");
        }

        const data = await response.json();
        window.sessionStorage.setItem("token", data.token);
        window.location.href = "./index.html";
    } catch (error) {
        msgError.textContent = "Email or password incorrect";
        // console.error("Error:", error);
    }
}
// const bearerAuth = window.localStorage.getItem("BearerAuth");
// document
//     .querySelector("form")
//     .addEventListener("submit", async function(e) {
//         //deleted préviously error message
//         e.preventDefault();
//         const previousError = document.querySelector(".msgError");
//         if (previousError) {
//             previousError.remove();
//         }
//         //creating form datas object
//         const loginFormDatas = {
//             email: e.target.querySelector("[name=email]").value,
//             password: e.target.querySelector("[name=password]").value
//         };
//         const datas = JSON.stringify(loginFormDatas);
//         // sending form data to server
//         await fetch("http://localhost:5678/api/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: datas
//         })
//         //answer
//         .then(r => {
//             if (r.ok === true) {
//                 return r.json();
//             } else if (r.status === 404 || r.status === 401) {
//                 throw new Error("Données d'identification incorrectes");
//             }
//         })
//         .then(body => {
//             //store datas in localStorage
//             window.localStorage.setItem("bearerAuth", JSON.stringify(body));
//             // redirection to homepage
//             window.location.replace("./index.html");
//         })
//         .catch(e=> {
//             // catching and displaying errors
//             const error = document.createElement("div");
//             error.classList.add(".msgError");
//             error.innerHTML = e.message;
//             document.querySelector("form").prepend(error);
//         })
//     });