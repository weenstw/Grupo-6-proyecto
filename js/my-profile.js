document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuario");
    const emailInput = document.getElementById("email");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const telefonoInput = document.getElementById("telefono");
    const profileForm = document.getElementById("profileForm");
    const alerta = document.getElementById("alerta");
    const profileImage = document.getElementById("profileImage");
    const imageInput = document.getElementById("imageInput");
    const navProfileImage = document.getElementById("navProfileImage");

    if (usuario) emailInput.value = usuario;

    const datosPerfil = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (datosPerfil) {
        nombreInput.value = datosPerfil.nombre || "";
        apellidoInput.value = datosPerfil.apellido || "";
        telefonoInput.value = datosPerfil.telefono || "";
        if (datosPerfil.imagen) {
            profileImage.src = datosPerfil.imagen;
            navProfileImage.src = datosPerfil.imagen;
        }
    }
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const datos = {
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            imagen: profileImage.src,
        };

        localStorage.setItem("perfilUsuario", JSON.stringify(datos));

        alerta.classList.remove("d-none");
        setTimeout(() => alerta.classList.add("d-none"), 2000);
    });

    imageInput.addEventListener("change", () => {
        const archivo = imageInput.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                const base64 = e.target.result;
                profileImage.src = base64;
                navProfileImage.src = base64;

                const datosPerfilActual = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
                datosPerfilActual.imagen = base64;
                localStorage.setItem("perfilUsuario", JSON.stringify(datosPerfilActual));
            };
            lector.readAsDataURL(archivo);
        }
    });
});
// Carga y muestra los datos del perfil guardados en localStorage (nombre, apellido,
// teléfono e imagen). Permite actualizar la información del usuario mediante un
// formulario y guardar los cambios localmente. También maneja la carga de una nueva
// imagen de perfil convirtiéndola a Base64 y actualizándola tanto en la vista como
// en el menú de navegación.