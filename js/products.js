// Define los criterios de ordenamiento y las variables globales usadas para manejar
// la lista de categorías, filtros y búsquedas.
// La función 'sortCategories' ordena las categorías según el criterio elegido
// (A-Z, Z-A o cantidad de productos).
// La función 'setCatID' guarda la categoría seleccionada y redirige a la página de productos.
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_SOLD_COUNT = "Vendidos";
const ORDER_ASC_BY_PRICE = "PRICE_ASC";
const ORDER_DESC_BY_PRICE = "PRICE_DESC";

let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let searchQuery = "";

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_SOLD_COUNT) {
        result = array.sort((a, b) => b.soldCount - a.soldCount);
    } else if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort((a, b) => a.cost - b.cost);
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort((a, b) => b.cost - a.cost);
    }
    return result;
}
// Muestra la lista de productos aplicando búsqueda, filtros y ordenamiento.
// Filtra por nombre, descripción y rango de precio, y genera dinámicamente
// las tarjetas de cada producto. Además agrega el evento de clic para redirigir
// al usuario a la página de información del producto seleccionado.
function showProductsList() {
    const contenedor = document.querySelector("main .container");
    contenedor.innerHTML = "";

    currentProductsArray.forEach(producto => {
        const matchesSearch =
            producto.name.toLowerCase().includes(searchQuery) ||
            producto.description.toLowerCase().includes(searchQuery);

        if (
            matchesSearch &&
            ((minCount === undefined) || (producto.cost >= minCount)) &&
            ((maxCount === undefined) || (producto.cost <= maxCount))
        ) {
            const itemHTML = `
                <div class="card mb-4 product-item" data-id="${producto.id}" style="cursor:pointer;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${producto.image}" class="img-fluid rounded-start" alt="${producto.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.name}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><small class="text-muted"><strong>Vendidos:</strong> ${producto.soldCount}</small></p>
                                <p class="card-text"><strong>${producto.currency} ${producto.cost}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += itemHTML;
        }
    });

    document.querySelectorAll(".product-item").forEach(item => {
        item.addEventListener("click", () => {
            const productId = item.getAttribute("data-id");
            localStorage.setItem("productID", productId);
            window.location = "product-info.html";
        });
    });
}
// Ordena el listado de productos según el criterio elegido y luego lo muestra.
// Si se recibe un nuevo arreglo de productos, lo actualiza antes de ordenar.
// Finalmente, vuelve a renderizar la lista en pantalla con el orden aplicado.
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    if (productsArray !== undefined) {
        currentProductsArray = productsArray;
    }
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProductsList();
}
// Carga los productos de la categoría seleccionada y configura todos los controles
// de la página: ordenamientos, filtros de precio y búsqueda. Cada acción del usuario
// vuelve a renderizar la lista de productos según los criterios aplicados.
document.addEventListener("DOMContentLoaded", function () {
    const catID = localStorage.getItem("catID");
    const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            currentProductsArray = data.products;
            showProductsList();
        })
        .catch(error => console.error("Error al cargar productos:", error));

    document.getElementById("sortAsc")?.addEventListener("click", () => {
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc")?.addEventListener("click", () => {
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount")?.addEventListener("click", () => {
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("sortPriceAsc")?.addEventListener("click", () => {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortPriceDesc")?.addEventListener("click", () => {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("clearRangeFilter")?.addEventListener("click", () => {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
        minCount = undefined;
        maxCount = undefined;
        showProductsList();
    });

    document.getElementById("rangeFilterCount")?.addEventListener("click", () => {
        const minInput = document.getElementById("rangeFilterCountMin").value;
        const maxInput = document.getElementById("rangeFilterCountMax").value;

        minCount = (minInput !== "" && parseInt(minInput) >= 0) ? parseInt(minInput) : undefined;
        maxCount = (maxInput !== "" && parseInt(maxInput) >= 0) ? parseInt(maxInput) : undefined;

        showProductsList();
    });

    document.getElementById("product-search")?.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        showProductsList();
    });
});
