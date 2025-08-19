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
