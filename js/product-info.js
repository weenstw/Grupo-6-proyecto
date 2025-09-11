document.addEventListener("DOMContentLoaded", function () {
    const productID = localStorage.getItem("productID");
    const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

    let images = [];
    let currentIndex = 0;
    let overlay, lightboxImg;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("product-name").textContent = data.name;
            document.getElementById("product-description").textContent = data.description;
            document.getElementById("product-category").textContent = data.category;
            document.getElementById("product-price").textContent = `${data.currency} ${data.cost}`;
            document.getElementById("product-soldcount").innerHTML = `<strong>Vendidos:</strong> ${data.soldCount}`;

            images = data.images;
            const imageContainer = document.getElementById("product-images");
            imageContainer.innerHTML = "";

            images.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.classList.add("img-thumbnail", "m-2");
                img.style.width = "300px";
                img.style.cursor = "pointer";

                img.addEventListener("click", () => {
                    currentIndex = index;
                    showLightbox();
                });

                imageContainer.appendChild(img);
            });
        })
        .catch(error => console.error("Error al cargar info del producto:", error));

    function showLightbox() {
        overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.9)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = 1000;

        lightboxImg = document.createElement("img");
        lightboxImg.src = images[currentIndex];
        lightboxImg.style.maxWidth = "80%";
        lightboxImg.style.maxHeight = "80%";
        lightboxImg.style.borderRadius = "8px";

        const closeBtn = document.createElement("span");
        closeBtn.textContent = "✖";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "20px";
        closeBtn.style.right = "30px";
        closeBtn.style.fontSize = "30px";
        closeBtn.style.color = "white";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });

        const prevBtn = document.createElement("span");
        prevBtn.textContent = "‹";
        prevBtn.style.position = "absolute";
        prevBtn.style.left = "30px";
        prevBtn.style.top = "50%";
        prevBtn.style.fontSize = "50px";
        prevBtn.style.color = "white";
        prevBtn.style.cursor = "pointer";
        prevBtn.style.userSelect = "none";
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex];
        });

        const nextBtn = document.createElement("span");
        nextBtn.textContent = "›";
        nextBtn.style.position = "absolute";
        nextBtn.style.right = "30px";
        nextBtn.style.top = "50%";
        nextBtn.style.fontSize = "50px";
        nextBtn.style.color = "white";
        nextBtn.style.cursor = "pointer";
        nextBtn.style.userSelect = "none";
        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex];
        });

        overlay.appendChild(lightboxImg);
        overlay.appendChild(closeBtn);
        overlay.appendChild(prevBtn);
        overlay.appendChild(nextBtn);
        document.body.appendChild(overlay);
    }
});
