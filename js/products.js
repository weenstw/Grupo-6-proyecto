document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const contenedor = document.querySelector("main .container");

    function mostrarProductos(lista) {
        contenedor.innerHTML = "";
        lista.forEach(producto => {
            const itemHTML = `
                <div class="card mb-4">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${producto.image}" class="img-fluid rounded-start" alt="${producto.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.name}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><small class="text-muted">Vendidos: ${producto.soldCount}</small></p>
                                <p class="card-text"><strong>${producto.currency} ${producto.cost}</strong></p>
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
        .then(data => mostrarProductos(data.products))
        .catch(error => console.error("Error al cargar productos:", error));
});

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_SOLD_COUNT = "Vendidos";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_SOLD_COUNT) {
        result = array.sort((a, b) => b.soldCount - a.soldCount);
    }
    return result;
}

function showProductsList() {
    const contenedor = document.querySelector("main .container");
    contenedor.innerHTML = "";

    currentProductsArray.forEach(producto => {
        if (((minCount === undefined) || (producto.cost >= minCount)) &&
            ((maxCount === undefined) || (producto.cost <= maxCount))) {

            const itemHTML = `
                <div class="card mb-4">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${producto.image}" class="img-fluid rounded-start" alt="${producto.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.name}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><small class="text-muted">Vendidos: ${producto.soldCount}</small></p>
                                <p class="card-text"><strong>${producto.currency} ${producto.cost}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += itemHTML;
        }
    });
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    if (productsArray !== undefined) {
        currentProductsArray = productsArray;
    }
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProductsList();
}

document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

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
});