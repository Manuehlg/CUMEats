/* ======================================
   CUMEATS - JS GLOBAL
====================================== */

document.addEventListener("DOMContentLoaded", function () {

    initLogin();
    initRestaurantCards();
    initTogglePassword();

});


/* ======================================
   LOGIN
====================================== */

function initLogin() {
    const form = document.getElementById("loginForm");

    if (!form) return; // Solo se ejecuta si existe

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Inicio de sesión simulado correctamente");
        window.location.href = "inicio.html";
    });
}

function initTogglePassword() {
    const toggleBtn = document.querySelector(".toggle-password");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", function () {
        const passwordInput = document.getElementById("password");
        passwordInput.type =
            passwordInput.type === "password" ? "text" : "password";
    });
}


/* ======================================
   RESTAURANTES (CARDS DINÁMICAS)
====================================== */

function initRestaurantCards() {
    const container = document.querySelector(".restaurants");
    if (!container) return;

    const restaurants = [
        {
            name: "Pizza Napoli",
            image: "../assets/pizza.jpg",
            rating: 4.5,
            delivery: "30-40 min"
        },
        {
            name: "Sushi House",
            image: "../assets/sushi.jpg",
            rating: 4.8,
            delivery: "20-30 min"
        }
    ];

    restaurants.forEach(r => {
        const card = document.createElement("div");
        card.classList.add("restaurant-card");

        card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <div class="info">
        <h3>${r.name}</h3>
        <p>⭐ ${r.rating} · ${r.delivery}</p>
      </div>
    `;

        container.appendChild(card);
    });
}

/* ===========================
   SIMULACIÓN DE SESIÓN
=========================== */

function updateNavbar() {
    const loginLink = document.getElementById("loginLink");
    if (!loginLink) return;

    const isLogged = localStorage.getItem("cumeatsUser");

    if (isLogged) {
        loginLink.textContent = "Cerrar sesión";
        loginLink.href = "#";

        loginLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("cumeatsUser");
            window.location.reload();
        });
    }
}

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Guardamos usuario simulado
        localStorage.setItem("cumeatsUser", "usuario");

        window.location.href = "inicio.html";
    });
}
