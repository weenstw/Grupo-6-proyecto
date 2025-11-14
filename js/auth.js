//verifica si hay un usuario logueado. Si no lo hay, redirecciona al login.
//ademas de eso si hay un usuario logeado inicializa el menú desplegable,
//pone en funcion el modo oscuro si el usuario lo tiene configurado
//actualiza el carrito con lo que el usuario haya guardado.
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

    const navProfileImage = document.getElementById("navProfileImage");
    const datosPerfil = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (navProfileImage && datosPerfil && datosPerfil.imagen) {
        navProfileImage.src = datosPerfil.imagen;
    }

    if (typeof initDropdownPerfil === "function") {
        initDropdownPerfil();
    }

    initDarkMode();
    actualizarContadorCarritoNav();
}
//watchdog de sesion, vigila constantemente que exista un usuario en el localStorage
//y maneja el menú del perfil y la función de cerrar sesión.
//redirige si la sesión se pierde, detecta logout desde otras pestañas,
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
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
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
// Inicializa el modo oscuro, lee la preferencia guardada, ajusta la UI,
// y permite activar/desactivar el dark mode con el interruptor, 
// guardando el estado en localStorage.
function initDarkMode() {
    const switchInput = document.getElementById("darkModeSwitch");
    const body = document.body;
    const jumbotron = document.querySelector(".jumbotron");

    if (!switchInput) return;

    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        enableDarkMode();
        switchInput.checked = true;
    } else {
        disableDarkMode();
        switchInput.checked = false;
    }

    switchInput.addEventListener("click", (e) => e.stopPropagation());
    switchInput.addEventListener("change", (e) => {
        e.stopPropagation();
        if (switchInput.checked) {
            enableDarkMode();
            localStorage.setItem("darkMode", "enabled");
        } else {
            disableDarkMode();
            localStorage.setItem("darkMode", "disabled");
        }
    });

    function enableDarkMode() {
        body.classList.add("dark-mode");
        if (jumbotron) {
            jumbotron.style.backgroundImage = "url('img/cover_back-B.png')";
        }
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        if (jumbotron) {
            jumbotron.style.backgroundImage = "url('img/cover_back.png')";
        }
    }
}
// Actualiza el contador del ícono del carrito en la barra de navegación,
// sumando la cantidad total de productos guardados en el localStorage.
function actualizarContadorCarritoNav() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = totalItems;
}