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

    // ======= INICIO: Actualizar contador carrito =======
    actualizarContadorCarritoNav();
    // ======= FIN: Actualizar contador carrito =======
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

// ======= INICIO: Función contador carrito =======
function actualizarContadorCarritoNav() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = totalItems;
}
// ======= FIN: Función contador carrito =======
