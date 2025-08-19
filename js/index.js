document.addEventListener("DOMContentLoaded", function () {
    const usuario = localStorage.getItem("usuario");
    initDropdownPerfil();
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
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
