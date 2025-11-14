document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (usuario !== '' && contrasena !== '') {
      localStorage.setItem('usuario', usuario);

      window.location.href = 'index.html';
    } else {
      alert('Por favor, complete ambos campos.');
    }
  });
});
// Maneja el formulario de inicio de sesión: valida que los campos no estén vacíos,
// guarda el usuario en el localStorage y redirige a la página principal.
// Si faltan datos, muestra un mensaje de error.