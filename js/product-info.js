// ======= CARGA DEL PRODUCTO PRINCIPAL CON GALERÍA =======
document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("productID");
  if (!productID) return;

  const url = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  let images = [];
  let currentIndex = 0;
  let overlay, lightboxImg;

  fetch(url)
    .then(response => response.json())
    .then(product => {
      document.querySelector("h2").textContent = product.name;
      document.querySelector(".lead").textContent = product.description;
      document.querySelector("p strong").nextSibling.textContent = ` ${product.currency} ${product.cost}`;

      images = product.images;

      const mainImage = document.getElementById("mainImage");
      mainImage.src = images[0];
      mainImage.alt = product.name;

      const galleryContainer = document.getElementById("galleryContainer");
      galleryContainer.innerHTML = "";

      images.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("img-thumbnail", "m-2");
        img.style.width = "200px";
        img.style.cursor = "pointer";
        img.style.borderRadius = "20px";

        img.addEventListener("click", () => {
          mainImage.src = imgSrc;
          currentIndex = index;
          showLightbox();
        });

        galleryContainer.appendChild(img);
      });
    })
    .catch(err => console.error("Error cargando producto:", err));

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



// ======= SISTEMA DE ESTRELLAS Y COMENTARIOS =======
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("ratingForm");
  const commentInput = document.getElementById("comment");
  const ratingList = document.querySelector(".list-group");
  const stars = document.querySelectorAll(".star-rating .star");

  let selectedRating = 0;
  const productID = localStorage.getItem("productID");

  // Función para dibujar estrellas en comentarios
  function generarEstrellas(score) {
    return "⭐".repeat(score) + "☆".repeat(5 - score);
  }

  // Cargar comentarios desde la API
  try {
    const res = await fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`);
    const comentarios = await res.json();

    comentarios.forEach(c => {
      const comentario = document.createElement("div");
      comentario.classList.add("list-group-item");
      comentario.innerHTML = `
        <h6 class="mb-1">${c.user} <small class="text-muted">${c.dateTime}</small></h6>
        <div class="text-warning">${generarEstrellas(c.score)}</div>
        <p class="mb-1">${c.description}</p>
      `;
      ratingList.appendChild(comentario);
    });
  } catch (err) {
    console.error("Error cargando comentarios:", err);
  }

  // Funciones para manejar hover y click de estrellas
  function highlightStars(value) {
    stars.forEach((s, index) => {
      s.textContent = index < value ? "⭐" : "☆";
    });
  }

  function resetHover() {
    stars.forEach((s, index) => {
      s.textContent = index < selectedRating ? "⭐" : "☆";
    });
  }

  // Eventos de cada estrella
  stars.forEach(star => {
    star.addEventListener("mouseover", () => {
      const value = parseInt(star.getAttribute("data-value"));
      highlightStars(value);
    });

    star.addEventListener("mouseout", () => {
      resetHover();
    });

    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-value"));
      resetHover();
    });
  });

  // Enviar nuevo comentario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const comentarioTexto = commentInput.value.trim();
    const usuario = localStorage.getItem("usuario") || "Usuario Anónimo";

    if (!comentarioTexto || selectedRating === 0) {
      alert("Por favor, completá todos los campos y seleccioná una calificación.");
      return;
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const segundos = String(fecha.getSeconds()).padStart(2, "0");
    const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    const nuevoComentario = document.createElement("div");
    nuevoComentario.classList.add("list-group-item");
    nuevoComentario.innerHTML = `
      <h6 class="mb-1">${usuario} <small class="text-muted">${fechaFormateada}</small></h6>
      <div class="text-warning">${generarEstrellas(selectedRating)}</div>
      <p class="mb-1">${comentarioTexto}</p>
    `;

    ratingList.prepend(nuevoComentario);

    commentInput.value = "";
    selectedRating = 0;
    resetHover();
  });
});


// ======= NUEVO: PRODUCTOS RELACIONADOS =======
document.addEventListener("DOMContentLoaded", async function () {
  const productID = localStorage.getItem("productID");
  if (!productID) return;

  const productUrl = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  try {
    const productRes = await fetch(productUrl);
    const productData = await productRes.json();

    const related = productData.relatedProducts;

    const relatedContainer = document.getElementById("relatedContainer");
    if (!relatedContainer) return;
    relatedContainer.innerHTML = "";

    related.forEach(p => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "col-sm-6", "mb-3");

      col.innerHTML = `
        <div class="card h-100 text-center related-card" style="cursor:pointer;">
          <img src="${p.image}" class="card-img-top p-2" alt="${p.name}">
          <div class="card-body">
            <p class="card-text">${p.name}</p>
          </div>
        </div>
      `;

      col.addEventListener("click", () => {
        localStorage.setItem("productID", p.id);
        window.location.href = "product-info.html";
      });

      relatedContainer.appendChild(col);
    });
  } catch (err) {
    console.error("Error cargando productos relacionados:", err);
  }
});
