document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    actualizarContadorCarrito();
});

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const container = document.getElementById("carritoContainer");
    const totalCarrito = document.getElementById("totalCarrito");

    if (carrito.length === 0) {
        container.innerHTML = `
      <div class="alert alert-warning text-center" style="
        position: fixed;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
      ">
        Vaya... Parece que tu carrito está vacío
      </div>
    `;
        totalCarrito.textContent = "0";
        return;
    }

    let html = `<table class="table table-hover active align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>`;

    let total = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.cost * item.cantidad;
        total += subtotal;

        html += `<tr>
              <td><img src="${item.img}" alt="${item.name}" style="width:80px;"></td>
              <td>${item.name}</td>
              <td>${item.currency} ${item.cost}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button class="btn btn-sm btn-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
              </td>
              <td>${item.currency} ${subtotal}</td>
              <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button></td>
            </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
    totalCarrito.textContent = total;
}

function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = total;
}
