// Define los criterios de ordenamiento y variables globales usadas para manejar
// la lista de categorías, incluyendo filtros y búsquedas.
// La función 'sortCategories' ordena las categorías según el criterio elegido
// (A-Z, Z-A o cantidad de productos). 
// La función 'setCatID' guarda la categoría seleccionada y redirige a la página de productos.
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let searchQuery = "";

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME){
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort((a, b) => parseInt(b.productCount) - parseInt(a.productCount));
    }
    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}
// Muestra la lista de categorías aplicando filtros (búsqueda, rango de productos)  
// y orden seleccionado. Además renderiza el HTML con la información de cada categoría.
//
// La función 'sortAndShowCategories' actualiza el criterio de ordenamiento,
// ordena el arreglo actual y vuelve a mostrar la lista.
function showCategoriesList(){
    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        const matchesSearch =
            category.name.toLowerCase().includes(searchQuery) ||
            category.description.toLowerCase().includes(searchQuery);

        if (
            matchesSearch &&
            ((minCount == undefined) || (parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (parseInt(category.productCount) <= maxCount))
        ){
            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
    showCategoriesList();
}
// Carga las categorías al iniciar la página, configura los botones de ordenamiento,
// aplica filtros por cantidad, restablece filtros, y permite buscar categorías.
// Cada acción actualiza dinámicamente la lista mostrada en pantalla.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data;
            showCategoriesList();
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
        minCount = undefined;
        maxCount = undefined;
        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        } else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined;
        }

        showCategoriesList();
    });

    document.getElementById("category-search")?.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        showCategoriesList();
    });
});
