function verificarUsuario() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    const usrElement = document.getElementById("usrname");
    if (usrElement) {
        usrElement.textContent = usuario;
    }

    if (typeof initDropdownPerfil === "function") {
        initDropdownPerfil();
    }
}

document.addEventListener("DOMContentLoaded", verificarUsuario);
setInterval(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario && window.location.pathname !== "/login.html") {
        window.location.href = "login.html";
    }
}, 1000);
window.addEventListener("storage", (event) => {
    if (event.key === "usuario" && !event.newValue) {
        window.location.href = "login.html";
    }
});


function initDropdownPerfil() {
    const boton = document.getElementById("boton");
    const dropdown = document.getElementById("dropdown");
    const logout = document.getElementById("logout");
    if (!boton || !dropdown || !logout) return;

    boton.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });


    document.addEventListener("click", (e) => {
        if (!boton.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });

    logout.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

}