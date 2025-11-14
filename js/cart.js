//Muestra en pantalla el carrito con todos los productos que el usuario tenía guardados.
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContadorCarrito();
});
//Toma los productos guardados en localStorage y los guarda en una variable para trabajar con ellos
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const container = document.getElementById("carritoContainer");
  const totalCarrito = document.getElementById("totalCarrito");
  //si el carrito no tiene productos muestra un mensaje en pantalla diciendo que está vacío.
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>`;

  let total = 0;

  carrito.forEach((item, index) => {
    let subtotal = item.cost * item.cantidad;
    total += subtotal;

    html += `<tr>
              <td><img src="${item.img}" alt="${item.name}"></td>
              <td>${item.name}</td>
              <td>${item.currency} ${item.cost}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button class="btn btn-sm btn-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
              </td>
              <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button></td>
            </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  totalCarrito.textContent = total;
}
//Controles del carrito
function cambiarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}
//calcula cuántos productos hay en total y actualiza el numerito del carrito.
function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}
//Controles del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = total;
}

//Este código valida toda la información necesaria para finalizar la compra,
//calcula los montos con envío incluido (en pesos o en USD)
//muestra un resumen
//en un modal y confirma la compra cuando el usuario acepta
document.addEventListener("DOMContentLoaded", () => {
  const finalizarBtn = document.getElementById("finalizarCompra");

  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
      }

      const subtotalNum = carrito.reduce((acc, item) => acc + item.cost * item.cantidad, 0);

      const envioSeleccionado = document.querySelector("input[name='envio']:checked");
      if (!envioSeleccionado) {
        alert("Seleccioná un tipo de envío antes de continuar.");
        return;
      }
      const envioPorcentaje = parseFloat(envioSeleccionado.value);
      const envioTexto = `${(envioPorcentaje * 100).toFixed(0)}%`;
      const envioCosto = subtotalNum * envioPorcentaje;


      const formaPago = document.getElementById("formaPago")?.value.trim();
      if (!formaPago) {
        alert("Seleccioná una forma de pago antes de continuar.");
        return;
      }

      const departamento = document.getElementById("departamento").value.trim();
      const localidad = document.getElementById("localidad").value.trim();
      const calle = document.getElementById("calle").value.trim();
      const numero = document.getElementById("numero").value.trim();
      const esquina = document.getElementById("esquina").value.trim();

      if (!departamento || !localidad || !calle || !numero || !esquina) {
        alert("Completá todos los campos de dirección antes de continuar.");
        return;
      }

      const direccion = `${departamento}, ${localidad}, ${calle} ${numero}, esquina ${esquina}`;

      const mostrandoUSD = document.getElementById("convertirMoneda")?.textContent === "Mostrar en Pesos";
      const tasaCambio = 42;

      let subtotalFinal = subtotalNum;
      let envioFinal = envioCosto;
      let totalFinal = subtotalNum + envioCosto;
      let simbolo = "$";

      if (mostrandoUSD) {
        subtotalFinal /= tasaCambio;
        envioFinal /= tasaCambio;
        totalFinal /= tasaCambio;
        simbolo = "USD ";
      }

      document.getElementById("modalSubtotal").textContent = `${simbolo}${subtotalFinal.toFixed(2)}`;
      document.getElementById("modalEnvio").textContent = `${simbolo}${envioFinal.toFixed(2)} (${envioTexto})`;
      document.getElementById("modalTotal").textContent = `${simbolo}${totalFinal.toFixed(2)}`;
      document.getElementById("modalPago").textContent = formaPago;
      document.getElementById("modalDireccion").textContent = direccion;

      const modal = new bootstrap.Modal(document.getElementById("modalCompra"));
      modal.show();
    });

    // Confirmar compra
    document.getElementById("confirmarCompra").addEventListener("click", () => {
      localStorage.removeItem("carrito");
      actualizarContadorCarrito();
      mostrarCarrito();
      alert("¡Compra confirmada con éxito!");
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalCompra"));
      modal.hide();
    });
  }
});

//conversión entre pesos y dólares en el carrito
//calcula  el subtotal según la moneda de cada product
document.addEventListener("DOMContentLoaded", () => {
  const botonCambio = document.getElementById("convertirMoneda");
  let mostrandoUSD = false;
  const tasaCambio = 42;

  function obtenerSubtotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    return carrito.reduce((acc, item) => {
      let precio = item.cost;

      if (item.currency === "USD") {
        precio = precio * tasaCambio; 
      }

      return acc + precio * item.cantidad;
    }, 0);
  }

  function actualizarMontos() {
    const subtotalElemento = document.getElementById("subtotalCarrito");
    const envioElemento = document.getElementById("envioTexto") || document.getElementById("envioCosto");
    const totalElemento = document.getElementById("totalCarrito");

    if (!subtotalElemento || !totalElemento) return;

    let subtotal = obtenerSubtotal();
    let envioValor = 0;

    if (envioElemento) {
      const envioTexto = envioElemento.textContent.replace(/[^0-9.]/g, "");
      envioValor = parseFloat(envioTexto) || 0;
    }

    const total = subtotal + envioValor;

    if (mostrandoUSD) {
      subtotalElemento.textContent = `USD ${(subtotal / tasaCambio).toFixed(2)}`;
      if (envioElemento) envioElemento.textContent = `USD ${(envioValor / tasaCambio).toFixed(2)}`;
      totalElemento.textContent = `USD ${(total / tasaCambio).toFixed(2)}`;
    } else {
      subtotalElemento.textContent = `$${subtotal.toFixed(2)}`;
      if (envioElemento) envioElemento.textContent = `$${envioValor.toFixed(2)}`;
      totalElemento.textContent = `$${total.toFixed(2)}`;
    }
  }

  if (botonCambio) {
    botonCambio.addEventListener("click", () => {
      mostrandoUSD = !mostrandoUSD;
      botonCambio.textContent = mostrandoUSD ? "Mostrar en Pesos" : "Mostrar en USD";
      actualizarMontos();
    });
  }

  const radiosEnvio = document.querySelectorAll("input[name='envio']");
  radiosEnvio.forEach(radio => {
    radio.addEventListener("change", () => {
      const subtotal = obtenerSubtotal();
      const porcentaje = parseFloat(radio.value);
      const costoEnvio = subtotal * porcentaje;

      const envioTextoElem = document.getElementById("envioTexto");
      if (envioTextoElem) envioTextoElem.textContent = `$${costoEnvio.toFixed(2)}`;

      const totalElemento = document.getElementById("totalCarrito");
      if (totalElemento) totalElemento.textContent = `$${(subtotal + costoEnvio).toFixed(2)}`;

      actualizarMontos();
    });
  });

  actualizarMontos();
});

//Calcula el subtotal del carrito a partir de los productos guardados en localStorage.
//Cada vez que el usuario elige un envío, calcula el costo según el porcentaje seleccionado,
//actualiza el total final y muestra el costo de envío en pantalla.
document.addEventListener("DOMContentLoaded", () => {
  const radiosEnvio = document.querySelectorAll("input[name='envio']");
  const totalCarrito = document.getElementById("totalCarrito");
  const subtotalCarrito = document.getElementById("subtotalCarrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let subtotal = carrito.reduce((sum, item) => sum + item.cost * item.cantidad, 0);
  subtotalCarrito.textContent = `$${subtotal.toFixed(2)}`;
  totalCarrito.textContent = `$${subtotal.toFixed(2)}`;

  radiosEnvio.forEach(radio => {
    radio.addEventListener("change", () => {
      const porcentaje = parseFloat(radio.value);
      const costoEnvio = subtotal * porcentaje;
      const totalFinal = subtotal + costoEnvio;


      totalCarrito.textContent = `$${totalFinal.toFixed(2)}`;
      const envioTextoElem = document.getElementById("envioTexto");
      if (envioTextoElem) {
        envioTextoElem.textContent = `$${costoEnvio.toFixed(2)}`;
      }
    });
  });
});