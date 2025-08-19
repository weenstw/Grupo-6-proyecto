document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const contenedor = document.querySelector("main .container");

    function mostrarProductos(lista) {
        contenedor.innerHTML = "";
        lista.forEach(producto => {
            const itemHTML = `
                <div class="card mb-4" style="max-width: 700px;">
                    <div class="row g-0">
                        <div class="col-md-10">
                            <img src="${producto.image}" class="img-fluid rounded-start" alt="${producto.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.name} - ${producto.currency} ${producto.cost}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><small class="text-muted">Vendidos: ${producto.soldCount}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += itemHTML;
        });
    }
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data.products);
        })
        .catch(error => console.error("Error al cargar productos:", error));
});