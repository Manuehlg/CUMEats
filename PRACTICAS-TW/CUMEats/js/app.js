/* ======================================
   CUMEATS - JS GLOBAL
====================================== */

document.addEventListener("DOMContentLoaded", function () {

    initLogin();
    initRegister();
    initTogglePassword();
    initHeroSearch();
    initHeroAutocomplete();
    initRestaurantCards();
    initRestaurantDetail();
    initEditRestaurant();
    updateNavbar();
    startSloganRotation();

});


/* ======================================
   BÚSQUEDA DESDE EL HERO (inicio.html)
====================================== */

function initHeroSearch() {
    const btn   = document.getElementById("hero-search-btn");
    const input = document.getElementById("hero-search");
    if (!btn || !input) return;

    function doSearch() {
        const query = input.value.trim();
        // Cerrar autocomplete
        const list = document.getElementById("autocomplete-list");
        if (list) list.innerHTML = "";
        if (query) {
            window.location.href = "restaurantes.html?buscar=" + encodeURIComponent(query);
        } else {
            window.location.href = "restaurantes.html";
        }
    }

    btn.addEventListener("click", doSearch);
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") doSearch();
    });
}

/* ======================================
   AUTOCOMPLETADO DEL HERO
====================================== */

function initHeroAutocomplete() {
    const input = document.getElementById("hero-search");
    const list  = document.getElementById("autocomplete-list");
    if (!input || !list) return;

    // Sugerencias: localidades + nombres de restaurantes + categorías
    const SUGGESTIONS = [
        // Localidades
        "Mérida",
        // Direcciones de ejemplo
        "Calle Principal, Mérida", "Avenida de Grecia, Mérida",
        "Calle Universidad, Mérida", "Plaza México, Mérida",
        "Calle del Senado, Mérida", "Coliseo Plaza, Mérida",
        // Restaurantes
        "Pizza Napoli", "Pide et Impera", "Los 300 del Tupper",
        "El Senado del Sushi", "Apuntes & Arepas", "Gladiator Burger",
        "Tesis & Tacos", "El Burrito",
    ];

    input.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        list.innerHTML = "";

        if (query.length < 2) return;

        const matches = SUGGESTIONS.filter(s =>
            s.toLowerCase().includes(query)
        ).slice(0, 6);

        if (matches.length === 0) return;

        matches.forEach(match => {
            const li = document.createElement("li");
            li.className = "autocomplete-item";

            // Resaltar la parte que coincide
            const idx   = match.toLowerCase().indexOf(query);
            const before = match.slice(0, idx);
            const bold   = match.slice(idx, idx + query.length);
            const after  = match.slice(idx + query.length);
            li.innerHTML = `${before}<strong>${bold}</strong>${after}`;

            li.addEventListener("mousedown", function (e) {
                e.preventDefault(); // evita que el input pierda el foco antes del click
                input.value = match;
                list.innerHTML = "";
                // Lanzar búsqueda inmediatamente
                window.location.href = "restaurantes.html?buscar=" + encodeURIComponent(match);
            });

            list.appendChild(li);
        });
    });

    // Cerrar lista al perder el foco
    input.addEventListener("blur", () => {
        setTimeout(() => { list.innerHTML = ""; }, 150);
    });

    // Navegación con teclado por las sugerencias
    input.addEventListener("keydown", function (e) {
        const items = list.querySelectorAll(".autocomplete-item");
        let active  = list.querySelector(".autocomplete-item.active");

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!active) { items[0]?.classList.add("active"); }
            else {
                active.classList.remove("active");
                const next = active.nextElementSibling;
                (next || items[0]).classList.add("active");
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!active) { items[items.length - 1]?.classList.add("active"); }
            else {
                active.classList.remove("active");
                const prev = active.previousElementSibling;
                (prev || items[items.length - 1]).classList.add("active");
            }
        } else if (e.key === "Enter") {
            if (active) {
                e.preventDefault();
                input.value = active.textContent;
                list.innerHTML = "";
                window.location.href = "restaurantes.html?buscar=" + encodeURIComponent(input.value.trim());
            }
        } else if (e.key === "Escape") {
            list.innerHTML = "";
        }
    });
}

/* ======================================
   HELPERS DE VALIDACIÓN
====================================== */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Muestra u oculta un error en un campo.
 * @returns {boolean} true si no hay error (ok), false si hay error
 */
function setError(errId, msg, input, ok = false) {
    const span = document.getElementById(errId);
    if (span) span.textContent = msg;
    if (input) {
        input.classList.toggle("input-invalid", !ok && msg !== "");
        input.classList.toggle("input-valid",   ok);
    }
    return ok;
}

/** Toast global reutilizable */
function showToastGlobal(msg) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "global-toast";
        toast.className = "save-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("toast-visible");
    setTimeout(() => toast.classList.remove("toast-visible"), 3000);
}


/* ======================================
   LOGIN CON VALIDACIÓN
====================================== */

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const emailInput = document.getElementById("login-email");
    const passInput  = document.getElementById("login-password");

    // Validación en tiempo real al salir del campo
    emailInput.addEventListener("blur", () => validateLoginEmail());
    passInput.addEventListener("blur",  () => validateLoginPass());

    // Limpiar error al escribir
    emailInput.addEventListener("input", () => setError("err-login-email", "", emailInput));
    passInput.addEventListener("input",  () => setError("err-login-password", "", passInput));

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const okEmail = validateLoginEmail();
        const okPass  = validateLoginPass();
        if (!okEmail || !okPass) return;

        localStorage.setItem("cumeatsUser", JSON.stringify({ email: emailInput.value.trim() }));
        showToastGlobal("✅ Sesión iniciada correctamente");
        setTimeout(() => window.location.href = "inicio.html", 1200);
    });

    function validateLoginEmail() {
        const val = emailInput.value.trim();
        if (!val) return setError("err-login-email", "El email es obligatorio.", emailInput);
        if (!isValidEmail(val)) return setError("err-login-email", "Introduce un email válido.", emailInput);
        return setError("err-login-email", "", emailInput, true);
    }
    function validateLoginPass() {
        const val = passInput.value;
        if (!val) return setError("err-login-password", "La contraseña es obligatoria.", passInput);
        if (val.length < 8) return setError("err-login-password", "Mínimo 8 caracteres.", passInput);
        return setError("err-login-password", "", passInput, true);
    }
}


/* ======================================
   REGISTRO CON VALIDACIÓN COMPLETA
====================================== */

function initRegister() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const fields = {
        name:    document.getElementById("reg-name"),
        surname: document.getElementById("reg-surname"),
        phone:   document.getElementById("reg-phone"),
        email:   document.getElementById("reg-email"),
        pass:    document.getElementById("reg-password"),
        confirm: document.getElementById("reg-confirm"),
    };

    // Validación en tiempo real al salir del campo
    fields.name.addEventListener("blur",    () => valName());
    fields.surname.addEventListener("blur", () => valSurname());
    fields.phone.addEventListener("blur",   () => valPhone());
    fields.email.addEventListener("blur",   () => valEmail());
    fields.pass.addEventListener("blur",    () => valPass());
    fields.confirm.addEventListener("blur", () => valConfirm());

    // Limpiar error al escribir
    Object.entries(fields).forEach(([k, el]) => {
        el.addEventListener("input", () => setError("err-reg-" + k, "", el));
    });
    // confirm usa "err-reg-confirm"
    fields.confirm.addEventListener("input", () => setError("err-reg-confirm", "", fields.confirm));

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const ok = [valName(), valSurname(), valPhone(), valEmail(), valPass(), valConfirm()];
        if (ok.includes(false)) return;

        const user = {
            name:    fields.name.value.trim() + " " + fields.surname.value.trim(),
            email:   fields.email.value.trim(),
            phone:   fields.phone.value.trim(),
        };
        localStorage.setItem("cumeatsUser", JSON.stringify(user));
        showToastGlobal("✅ Cuenta creada correctamente");
        setTimeout(() => window.location.href = "inicio.html", 1200);
    });

    function valName() {
        const v = fields.name.value.trim();
        if (!v) return setError("err-reg-name", "El nombre es obligatorio.", fields.name);
        if (v.length < 2) return setError("err-reg-name", "Mínimo 2 caracteres.", fields.name);
        return setError("err-reg-name", "", fields.name, true);
    }
    function valSurname() {
        const v = fields.surname.value.trim();
        if (!v) return setError("err-reg-surname", "Los apellidos son obligatorios.", fields.surname);
        if (v.length < 2) return setError("err-reg-surname", "Mínimo 2 caracteres.", fields.surname);
        return setError("err-reg-surname", "", fields.surname, true);
    }
    function valPhone() {
        const v = fields.phone.value.trim();
        if (!v) return setError("err-reg-phone", "El teléfono es obligatorio.", fields.phone);
        if (!/^[6-9]\d{8}$/.test(v)) return setError("err-reg-phone", "Formato no válido (ej: 612345678).", fields.phone);
        return setError("err-reg-phone", "", fields.phone, true);
    }
    function valEmail() {
        const v = fields.email.value.trim();
        if (!v) return setError("err-reg-email", "El email es obligatorio.", fields.email);
        if (!isValidEmail(v)) return setError("err-reg-email", "Introduce un email válido.", fields.email);
        return setError("err-reg-email", "", fields.email, true);
    }
    function valPass() {
        const v = fields.pass.value;
        if (!v) return setError("err-reg-password", "La contraseña es obligatoria.", fields.pass);
        if (v.length < 8) return setError("err-reg-password", "Mínimo 8 caracteres.", fields.pass);
        if (!/[A-Z]/.test(v)) return setError("err-reg-password", "Debe contener al menos una mayúscula.", fields.pass);
        if (!/\d/.test(v)) return setError("err-reg-password", "Debe contener al menos un número.", fields.pass);
        return setError("err-reg-password", "", fields.pass, true);
    }
    function valConfirm() {
        const v = fields.confirm.value;
        if (!v) return setError("err-reg-confirm", "Confirma tu contraseña.", fields.confirm);
        if (v !== fields.pass.value) return setError("err-reg-confirm", "Las contraseñas no coinciden.", fields.confirm);
        return setError("err-reg-confirm", "", fields.confirm, true);
    }
}


/* ======================================
   MOSTRAR / OCULTAR PASSWORD
====================================== */

function initTogglePassword() {
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.dataset.target || "password";
            const input = document.getElementById(targetId);
            if (!input) return;
            input.type = input.type === "password" ? "text" : "password";
            this.textContent = input.type === "password" ? "👁" : "🙈";
        });
    });
}


/* ======================================
   NAVBAR SEGÚN SESIÓN
====================================== */

function updateNavbar() {
    const loginLink = document.getElementById("loginLink");
    if (!loginLink) return;

    const user = localStorage.getItem("cumeatsUser");

    if (user) {
        loginLink.textContent = "Cerrar sesión";
        loginLink.href = "#";

        loginLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("cumeatsUser");
            window.location.reload();
        });
    }
}


/* ======================================
   RESTAURANTES DINÁMICOS
====================================== */

function initRestaurantCards() {
    const container = document.getElementById("restaurants-grid");
    if (!container) return;

    const ALL_RESTAURANTS = [
        {
            name: "Pizza Napoli", image: "../assets/italiano.png", rating: 4.5,
            delivery: "30-40 min", deliveryMax: 40, category: "pizza",
            address: "Calle Principal 1, Mérida", phone: "924000001",
            email: "info@pizzanapoli.com", price: 12,
            categories: ["Pizza", "Italiana"], bike: true,
            menu: [
                { name: "Pizza Margherita", desc: "Tomate, mozzarella, albahaca", price: 8.50 },
                { name: "Pizza Pepperoni", desc: "Pepperoni, queso extra", price: 10.50 }
            ]
        },
        {
            name: "Pide et Impera", image: "../assets/burg.png", rating: 4.2,
            delivery: "35-45 min", deliveryMax: 45, category: "pizza",
            address: "Calle Secundaria 5, Mérida", phone: "924000002",
            email: "info@pideetimpera.com", price: 14,
            categories: ["Pizza", "Italiana"], bike: true,
            menu: [
                { name: "Pizza Romana", desc: "Aceitunas, anchoas, orégano", price: 9.50 },
                { name: "Pizza César", desc: "Pollo, queso parmesano", price: 11.00 }
            ]
        },
        {
            name: "Los 300 del Tupper", image: "../assets/susi.png", rating: 4.8,
            delivery: "20-30 min", deliveryMax: 30, category: "sushi",
            address: "Avenida de Grecia 10, Mérida", phone: "924000003",
            email: "contacto@los300tupper.com", price: 25,
            categories: ["Sushi", "Japonesa"], bike: true,
            menu: [
                { name: "Sushi Especial 300", desc: "30 piezas variadas", price: 18.50 },
                { name: "Maki Roll", desc: "Rollo de salmón y aguacate", price: 12.00 }
            ]
        },
        {
            name: "El Senado del Sushi", image: "../assets/rumano.png", rating: 4.7,
            delivery: "25-35 min", deliveryMax: 35, category: "sushi",
            address: "Calle del Senado 3, Mérida", phone: "924000004",
            email: "info@senadosushi.com", price: 28,
            categories: ["Sushi", "Japonesa"], bike: false,
            menu: [
                { name: "Sushi Imperial", desc: "Selección del chef", price: 22.00 },
                { name: "Temaki Salmón", desc: "Cucurucho de alga con salmón", price: 9.50 }
            ]
        },
        {
            name: "Apuntes & Arepas", image: "../assets/burgui.png", rating: 4.3,
            delivery: "25-35 min", deliveryMax: 35, category: "burgers",
            address: "Calle de los Estudiantes 7, Mérida", phone: "924000005",
            email: "hola@apuntesyarepas.com", price: 12,
            categories: ["Venezolana", "Arepas"], bike: true,
            menu: [
                { name: "Arepa Reina Pepiada", desc: "Pollo, aguacate, mayonesa", price: 5.50 },
                { name: "Arepa Pabellón", desc: "Carne, plátano, queso", price: 6.50 }
            ]
        },
        {
            name: "Gladiator Burger", image: "../assets/bagg.png", rating: 4.1,
            delivery: "20-30 min", deliveryMax: 30, category: "burgers",
            address: "Coliseo Plaza 2, Mérida", phone: "924000006",
            email: "info@gladiatorburger.com", price: 14,
            categories: ["Burger", "Americana"], bike: true,
            menu: [
                { name: "Gladiator Burger", desc: "Doble carne, queso, bacon", price: 11.50 },
                { name: "Patatas Gladiador", desc: "Con salsa especial", price: 4.50 }
            ]
        },
        {
            name: "Tesis & Tacos", image: "../assets/tacos.png", rating: 4.6,
            delivery: "20-25 min", deliveryMax: 25, category: "mexicana",
            address: "Calle Universidad 15, Mérida", phone: "924000007",
            email: "contacto@tesistacos.com", price: 10,
            categories: ["Mexicana", "Tacos"], bike: true,
            menu: [
                { name: "Tacos al Pastor", desc: "3 tacos con piña", price: 6.50 },
                { name: "Quesadillas", desc: "Con queso y tu elección de carne", price: 5.50 }
            ]
        },
        {
            name: "El Burrito", image: "../assets/pingu.png", rating: 4.4,
            delivery: "25-30 min", deliveryMax: 30, category: "mexicana",
            address: "Plaza México 4, Mérida", phone: "924000008",
            email: "info@elburrito.com", price: 12,
            categories: ["Mexicana", "Burritos"], bike: false,
            menu: [
                { name: "Burrito Grande", desc: "Carne, frijoles, arroz, queso", price: 9.50 },
                { name: "Nachos Supreme", desc: "Con guacamole y queso", price: 7.00 }
            ]
        }
    ];

    // --- Estado de filtros ---
    const state = {
        search: "",
        categoria: "todas",
        precioMax: 30,
        ratingMin: 0,
        fastDelivery: false,
        bike: false
    };

    // Leer parámetros de la URL al entrar
    const urlParams = new URLSearchParams(window.location.search);
    const catUrl    = urlParams.get("categoria");
    const buscarUrl = urlParams.get("buscar");
    if (catUrl)    state.categoria = catUrl;
    if (buscarUrl) state.search    = buscarUrl;

    // --- Referencias DOM ---
    const categoryTitle = document.getElementById("category-title");
    const resultsCount  = document.getElementById("results-count");
    const searchInput   = document.getElementById("search-input");
    const priceRange    = document.getElementById("price-range");
    const priceDisplay  = document.getElementById("price-display");
    const fastCheck     = document.getElementById("fast-delivery");
    const bikeCheck     = document.getElementById("bike-friendly");
    const clearAllBtn   = document.getElementById("clear-all-filters");
    const catBtns       = document.querySelectorAll(".filter-cat");
    const ratingBtns    = document.querySelectorAll(".filter-rating");

    // Marcar categoría activa si viene de la URL
    catBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === state.categoria);
    });

    // Pre-rellenar el input de búsqueda si viene de la URL
    if (buscarUrl && searchInput) {
        searchInput.value = buscarUrl;
    }

    // --- Render ---
    function renderCards() {
        const lista = ALL_RESTAURANTS.filter((r) => {
            const q = state.search.toLowerCase();
            const matchSearch = !q ||
                r.name.toLowerCase().includes(q) ||
                r.address.toLowerCase().includes(q) ||
                r.categories.some(c => c.toLowerCase().includes(q));
            const matchCat   = state.categoria === "todas" || r.category === state.categoria;
            const matchPrice = r.price <= state.precioMax;
            const matchRating = r.rating >= state.ratingMin;
            const matchFast  = !state.fastDelivery || r.deliveryMax <= 30;
            const matchBike  = !state.bike || r.bike === true;
            return matchSearch && matchCat && matchPrice && matchRating && matchFast && matchBike;
        });

        // Título
        const catLabels = {
            todas: "Todos los restaurantes",
            pizza: "🍕 Pizza",
            burgers: "🍔 Burgers",
            sushi: "🍣 Sushi",
            mexicana: "🌮 Mexicana"
        };
        if (categoryTitle) categoryTitle.textContent = catLabels[state.categoria] || "Restaurantes";
        if (resultsCount) resultsCount.textContent = lista.length + " resultado" + (lista.length !== 1 ? "s" : "");

        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = "<p class='no-results'>😕 No hay restaurantes que coincidan con los filtros.</p>";
            return;
        }

        lista.forEach(r => {
            const originalIndex = ALL_RESTAURANTS.findIndex(x => x.name === r.name);
            const card = document.createElement("div");
            card.classList.add("restaurant-card");

            const priceDots = r.price <= 10 ? "€" : r.price <= 18 ? "€€" : "€€€";

            card.innerHTML = `
                <img src="${r.image}" alt="${r.name}">
                <div class="card-body">
                    <h3>${r.name}</h3>
                    <div class="card-meta">
                        <span class="card-rating">⭐ ${r.rating}</span>
                        <span class="card-sep">·</span>
                        <span class="card-time">🕐 ${r.delivery}</span>
                        <span class="card-sep">·</span>
                        <span class="card-price">${priceDots} ${r.price}€ pedido mín.</span>
                    </div>
                    <div class="card-tags">
                        ${r.categories.map(c => `<span class="card-tag">${c}</span>`).join("")}
                        ${r.bike ? '<span class="card-tag bike">🚲 Bike</span>' : ""}
                    </div>
                    <p class="card-address">📍 ${r.address}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `detalles.html?id=${originalIndex}`;
            });

            container.appendChild(card);
        });
    }

    // --- Eventos de filtros ---
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            state.search = searchInput.value;
            renderCards();
        });
    }

    catBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.categoria = btn.dataset.cat;
            catBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderCards();
        });
    });

    if (priceRange) {
        priceRange.addEventListener("input", () => {
            state.precioMax = parseInt(priceRange.value);
            if (priceDisplay) priceDisplay.textContent = priceRange.value + "€";
            renderCards();
        });
    }

    ratingBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.ratingMin = parseFloat(btn.dataset.min);
            ratingBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderCards();
        });
    });

    if (fastCheck) {
        fastCheck.addEventListener("change", () => {
            state.fastDelivery = fastCheck.checked;
            renderCards();
        });
    }

    if (bikeCheck) {
        bikeCheck.addEventListener("change", () => {
            state.bike = bikeCheck.checked;
            renderCards();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            state.search = "";
            state.categoria = "todas";
            state.precioMax = 30;
            state.ratingMin = 0;
            state.fastDelivery = false;
            state.bike = false;

            if (searchInput) searchInput.value = "";
            if (priceRange) { priceRange.value = 30; priceDisplay.textContent = "30€"; }
            if (fastCheck) fastCheck.checked = false;
            if (bikeCheck) bikeCheck.checked = false;
            catBtns.forEach(b => b.classList.toggle("active", b.dataset.cat === "todas"));
            ratingBtns.forEach(b => b.classList.toggle("active", b.dataset.min === "0"));
            renderCards();
        });
    }

    // Render inicial
    renderCards();
}




/* ======================================
   SLOGAN DINÁMICO
====================================== */

const slogans = [
    "Pide facil. Come mejor.",
    "Hoy cocinan otros por ti 😎",
    "Tu antojo empieza aqui",
    "Mas rapido que cocinar",
    "La dieta empieza mañana",
    "Tu recompensa por ese 5",
    "Cocinar es de graduados",
    "Estudiar da hambre",
    "Te has quedado sin tupers?"
];

let sloganIndex = 0;

function startSloganRotation() {
    const element = document.getElementById("dynamic-slogan");
    if (!element) return;

    setInterval(() => {
        // Salida: sube y desaparece
        element.classList.add("fade");

        setTimeout(() => {
            sloganIndex = (sloganIndex + 1) % slogans.length;
            element.textContent = slogans[sloganIndex];

            // Prepara entrada desde abajo
            element.classList.remove("fade");
            element.classList.add("slogan-enter");

            // Fuerza reflow para que la transición se active
            element.getBoundingClientRect();

            // Entrada: sube a su posición normal
            element.classList.remove("slogan-enter");
        }, 420);

    }, 3000);
}

/* ======================================
   DETALLE DE RESTAURANTE
====================================== */

function initRestaurantDetail() {
    const nameEl = document.getElementById("restaurantName");
    if (!nameEl) return;

    const restaurants = [
        {
            name: "Pizza Napoli", image: "../assets/italiano.png", rating: 4.5, delivery: "30-40 min",
            category: "pizza", address: "Calle Principal 1, Mérida", phone: "924000001",
            email: "info@pizzanapoli.com", price: 12, categories: ["Pizza", "Italiana"], bike: true,
            menu: [
                { name: "Pizza Margherita", desc: "Tomate, mozzarella, albahaca", price: 8.50 },
                { name: "Pizza Pepperoni", desc: "Pepperoni, queso extra", price: 10.50 }
            ]
        },
        {
            name: "Pide et Impera", image: "../assets/burg.png", rating: 4.2, delivery: "35-45 min",
            category: "pizza", address: "Calle Secundaria 5, Mérida", phone: "924000002",
            email: "info@pideetimpera.com", price: 14, categories: ["Pizza", "Italiana"], bike: true,
            menu: [
                { name: "Pizza Romana", desc: "Aceitunas, anchoas, orégano", price: 9.50 },
                { name: "Pizza César", desc: "Pollo, queso parmesano", price: 11.00 }
            ]
        },
        {
            name: "Los 300 del Tupper", image: "../assets/susi.png", rating: 4.8, delivery: "20-30 min",
            category: "sushi", address: "Avenida de Grecia 10, Mérida", phone: "924000003",
            email: "contacto@los300tupper.com", price: 25, categories: ["Sushi", "Japonesa"], bike: true,
            menu: [
                { name: "Sushi Especial 300", desc: "30 piezas variadas", price: 18.50 },
                { name: "Maki Roll", desc: "Rollo de salmón y aguacate", price: 12.00 }
            ]
        },
        {
            name: "El Senado del Sushi", image: "../assets/rumano.png", rating: 4.7, delivery: "25-35 min",
            category: "sushi", address: "Calle del Senado 3, Mérida", phone: "924000004",
            email: "info@senadosushi.com", price: 28, categories: ["Sushi", "Japonesa"], bike: false,
            menu: [
                { name: "Sushi Imperial", desc: "Selección del chef", price: 22.00 },
                { name: "Temaki Salmón", desc: "Cucurucho de alga con salmón", price: 9.50 }
            ]
        },
        {
            name: "Apuntes & Arepas", image: "../assets/burgui.png", rating: 4.3, delivery: "25-35 min",
            category: "burgers", address: "Calle de los Estudiantes 7, Mérida", phone: "924000005",
            email: "hola@apuntesyarepas.com", price: 12, categories: ["Venezolana", "Arepas"], bike: true,
            menu: [
                { name: "Arepa Reina Pepiada", desc: "Pollo, aguacate, mayonesa", price: 5.50 },
                { name: "Arepa Pabellón", desc: "Carne, plátano, queso", price: 6.50 }
            ]
        },
        {
            name: "Gladiator Burger", image: "../assets/bagg.png", rating: 4.1, delivery: "20-30 min",
            category: "burgers", address: "Coliseo Plaza 2, Mérida", phone: "924000006",
            email: "info@gladiatorburger.com", price: 14, categories: ["Burger", "Americana"], bike: true,
            menu: [
                { name: "Gladiator Burger", desc: "Doble carne, queso, bacon", price: 11.50 },
                { name: "Patatas Gladiador", desc: "Con salsa especial", price: 4.50 }
            ]
        },
        {
            name: "Tesis & Tacos", image: "../assets/tacos.png", rating: 4.6, delivery: "20-25 min",
            category: "mexicana", address: "Calle Universidad 15, Mérida", phone: "924000007",
            email: "contacto@tesistacos.com", price: 10, categories: ["Mexicana", "Tacos"], bike: true,
            menu: [
                { name: "Tacos al Pastor", desc: "3 tacos con piña", price: 6.50 },
                { name: "Quesadillas", desc: "Con queso y tu elección de carne", price: 5.50 }
            ]
        },
        {
            name: "El Burrito", image: "../assets/pingu.png", rating: 4.4, delivery: "25-30 min",
            category: "mexicana", address: "Plaza México 4, Mérida", phone: "924000008",
            email: "info@elburrito.com", price: 12, categories: ["Mexicana", "Burritos"], bike: false,
            menu: [
                { name: "Burrito Grande", desc: "Carne, frijoles, arroz, queso", price: 9.50 },
                { name: "Nachos Supreme", desc: "Con guacamole y queso", price: 7.00 }
            ]
        }
    ];

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const r = restaurants[id];

    if (!r) {
        nameEl.textContent = "Restaurante no encontrado";
        return;
    }

    document.title = r.name + " | CUMEats";
    nameEl.textContent = r.name;
    document.getElementById("restaurantAddress").textContent   = r.address;
    document.getElementById("restaurantPhone").textContent     = r.phone;
    document.getElementById("restaurantEmail").textContent     = r.email;
    document.getElementById("restaurantPrice").textContent     = r.price;
    document.getElementById("restaurantCategories").textContent = r.categories.join(", ");
    document.getElementById("restaurantRating").textContent    = r.rating;
    document.getElementById("restaurantBike").textContent      = r.bike ? "✅ Sí" : "❌ No";

    // Enlace de edición
    const editLink = document.getElementById("edit-link");
    if (editLink) editLink.href = `edicion_rest.html?id=${id}`;

    const menuContainer = document.getElementById("menuContainer");
    if (menuContainer && r.menu) {
        r.menu.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("menu-item");
            div.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="menu-price">${item.price.toFixed(2)} €</span>
            `;
            menuContainer.appendChild(div);
        });
    }

    // Botón volver
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "restaurantes.html";
        });
    }
}

/* ======================================
   EDICIÓN DE RESTAURANTE
====================================== */

function initEditRestaurant() {
    const form = document.getElementById("edit-form");
    if (!form) return;

    const ALL_RESTAURANTS = [
        { name: "Pizza Napoli", image: "../assets/italiano.png", rating: 4.5, delivery: "30-40 min", deliveryMax: 40, category: "pizza", address: "Calle Principal 1, Mérida", phone: "924000001", email: "info@pizzanapoli.com", price: 12, categories: ["Pizza", "Italiana"], bike: true, menu: [{ name: "Pizza Margherita", desc: "Tomate, mozzarella, albahaca", price: 8.50 }, { name: "Pizza Pepperoni", desc: "Pepperoni, queso extra", price: 10.50 }] },
        { name: "Pide et Impera", image: "../assets/burg.png", rating: 4.2, delivery: "35-45 min", deliveryMax: 45, category: "pizza", address: "Calle Secundaria 5, Mérida", phone: "924000002", email: "info@pideetimpera.com", price: 14, categories: ["Pizza", "Italiana"], bike: true, menu: [{ name: "Pizza Romana", desc: "Aceitunas, anchoas, orégano", price: 9.50 }, { name: "Pizza César", desc: "Pollo, queso parmesano", price: 11.00 }] },
        { name: "Los 300 del Tupper", image: "../assets/susi.png", rating: 4.8, delivery: "20-30 min", deliveryMax: 30, category: "sushi", address: "Avenida de Grecia 10, Mérida", phone: "924000003", email: "contacto@los300tupper.com", price: 25, categories: ["Sushi", "Japonesa"], bike: true, menu: [{ name: "Sushi Especial 300", desc: "30 piezas variadas", price: 18.50 }, { name: "Maki Roll", desc: "Rollo de salmón y aguacate", price: 12.00 }] },
        { name: "El Senado del Sushi", image: "../assets/rumano.png", rating: 4.7, delivery: "25-35 min", deliveryMax: 35, category: "sushi", address: "Calle del Senado 3, Mérida", phone: "924000004", email: "info@senadosushi.com", price: 28, categories: ["Sushi", "Japonesa"], bike: false, menu: [{ name: "Sushi Imperial", desc: "Selección del chef", price: 22.00 }, { name: "Temaki Salmón", desc: "Cucurucho de alga con salmón", price: 9.50 }] },
        { name: "Apuntes & Arepas", image: "../assets/burgui.png", rating: 4.3, delivery: "25-35 min", deliveryMax: 35, category: "burgers", address: "Calle de los Estudiantes 7, Mérida", phone: "924000005", email: "hola@apuntesyarepas.com", price: 12, categories: ["Venezolana", "Arepas"], bike: true, menu: [{ name: "Arepa Reina Pepiada", desc: "Pollo, aguacate, mayonesa", price: 5.50 }, { name: "Arepa Pabellón", desc: "Carne, plátano, queso", price: 6.50 }] },
        { name: "Gladiator Burger", image: "../assets/bagg.png", rating: 4.1, delivery: "20-30 min", deliveryMax: 30, category: "burgers", address: "Coliseo Plaza 2, Mérida", phone: "924000006", email: "info@gladiatorburger.com", price: 14, categories: ["Burger", "Americana"], bike: true, menu: [{ name: "Gladiator Burger", desc: "Doble carne, queso, bacon", price: 11.50 }, { name: "Patatas Gladiador", desc: "Con salsa especial", price: 4.50 }] },
        { name: "Tesis & Tacos", image: "../assets/tacos.png", rating: 4.6, delivery: "20-25 min", deliveryMax: 25, category: "mexicana", address: "Calle Universidad 15, Mérida", phone: "924000007", email: "contacto@tesistacos.com", price: 10, categories: ["Mexicana", "Tacos"], bike: true, menu: [{ name: "Tacos al Pastor", desc: "3 tacos con piña", price: 6.50 }, { name: "Quesadillas", desc: "Con queso y tu elección de carne", price: 5.50 }] },
        { name: "El Burrito", image: "../assets/pingu.png", rating: 4.4, delivery: "25-30 min", deliveryMax: 30, category: "mexicana", address: "Plaza México 4, Mérida", phone: "924000008", email: "info@elburrito.com", price: 12, categories: ["Mexicana", "Burritos"], bike: false, menu: [{ name: "Burrito Grande", desc: "Carne, frijoles, arroz, queso", price: 9.50 }, { name: "Nachos Supreme", desc: "Con guacamole y queso", price: 7.00 }] }
    ];

    // Leer id de la URL y cargar datos del restaurante (o datos vacíos si no hay id)
    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get("id"));
    const base    = ALL_RESTAURANTS[id] || null;

    // Estado local del formulario (fusiona base + localStorage si existe)
    const storageKey = `cumeats_edit_${isNaN(id) ? "new" : id}`;
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    const data  = saved || (base ? JSON.parse(JSON.stringify(base)) : { name: "", address: "", phone: "", email: "", price: "", rating: "", delivery: "", category: "pizza", categories: [], bike: false, menu: [] });

    // ── Rellenar campos ──
    document.getElementById("edit-name").value     = data.name     || "";
    document.getElementById("edit-address").value  = data.address  || "";
    document.getElementById("edit-phone").value    = data.phone    || "";
    document.getElementById("edit-email").value    = data.email    || "";
    document.getElementById("edit-price").value    = data.price    || "";
    document.getElementById("edit-rating").value   = data.rating   || "";
    document.getElementById("edit-delivery").value = data.delivery || "";
    document.getElementById("edit-bike").checked   = !!data.bike;

    const catSelect = document.getElementById("edit-category");
    if (data.category) catSelect.value = data.category;

    // Actualizar título de la página
    if (base) document.title = `Editar: ${base.name} | CUMEats`;

    // ── Tags ──
    let tags = Array.isArray(data.categories) ? [...data.categories] : [];

    function renderTags() {
        const container = document.getElementById("tags-container");
        container.innerHTML = "";
        tags.forEach((tag, i) => {
            const span = document.createElement("span");
            span.className = "edit-tag";
            span.innerHTML = `${tag} <button type="button" class="tag-remove" data-i="${i}">×</button>`;
            container.appendChild(span);
        });
        container.querySelectorAll(".tag-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                tags.splice(parseInt(btn.dataset.i), 1);
                renderTags();
            });
        });
    }

    renderTags();

    document.getElementById("tag-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = this.value.trim();
            if (val && !tags.includes(val)) {
                tags.push(val);
                renderTags();
            }
            this.value = "";
        }
    });

    // ── Platos ──
    let menu = Array.isArray(data.menu) ? [...data.menu] : [];

    function renderDishes() {
        const list     = document.getElementById("dish-list");
        const emptyMsg = document.getElementById("empty-menu-msg");
        list.innerHTML = "";
        emptyMsg.style.display = menu.length === 0 ? "block" : "none";

        menu.forEach((dish, i) => {
            const row = document.createElement("div");
            row.className = "dish-row";
            row.innerHTML = `
                <div class="dish-row-info">
                    <span class="dish-row-name">${dish.name}</span>
                    <span class="dish-row-desc">${dish.desc}</span>
                </div>
                <span class="dish-row-price">${parseFloat(dish.price).toFixed(2)} €</span>
                <div class="dish-row-actions">
                    <button type="button" class="btn-dish-edit" data-i="${i}" title="Editar">✏️</button>
                    <button type="button" class="btn-dish-del"  data-i="${i}" title="Eliminar">🗑️</button>
                </div>
            `;
            list.appendChild(row);
        });

        // Eliminar plato
        list.querySelectorAll(".btn-dish-del").forEach(btn => {
            btn.addEventListener("click", () => {
                menu.splice(parseInt(btn.dataset.i), 1);
                renderDishes();
            });
        });

        // Editar plato (carga datos en el formulario de añadir)
        list.querySelectorAll(".btn-dish-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.i);
                document.getElementById("dish-name").value  = menu[i].name;
                document.getElementById("dish-desc").value  = menu[i].desc;
                document.getElementById("dish-price").value = menu[i].price;
                document.getElementById("add-dish-btn").textContent = "💾 Actualizar plato";
                document.getElementById("add-dish-btn").dataset.editIndex = i;
                document.getElementById("dish-name").focus();
            });
        });
    }

    renderDishes();

    document.getElementById("add-dish-btn").addEventListener("click", function () {
        const errDish  = document.getElementById("err-dish");
        const nameVal  = document.getElementById("dish-name").value.trim();
        const priceVal = parseFloat(document.getElementById("dish-price").value);
        const descVal  = document.getElementById("dish-desc").value.trim();

        if (!nameVal) { errDish.textContent = "El nombre del plato es obligatorio."; return; }
        if (isNaN(priceVal) || priceVal < 0) { errDish.textContent = "Introduce un precio válido."; return; }
        errDish.textContent = "";

        const editIdx = this.dataset.editIndex;
        if (editIdx !== undefined && editIdx !== "") {
            menu[parseInt(editIdx)] = { name: nameVal, desc: descVal, price: priceVal };
            delete this.dataset.editIndex;
            this.textContent = "＋ Añadir plato";
        } else {
            menu.push({ name: nameVal, desc: descVal, price: priceVal });
        }

        document.getElementById("dish-name").value  = "";
        document.getElementById("dish-desc").value  = "";
        document.getElementById("dish-price").value = "";
        renderDishes();
    });

    // ── Validación y guardado ──
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let valid = true;

        function check(inputId, errId, msg) {
            const el = document.getElementById(inputId);
            const err = document.getElementById(errId);
            if (!el.value.trim()) { err.textContent = msg; el.classList.add("input-error"); valid = false; }
            else { err.textContent = ""; el.classList.remove("input-error"); }
        }

        check("edit-name",    "err-name",    "El nombre es obligatorio.");
        check("edit-address", "err-address", "La dirección es obligatoria.");
        check("edit-phone",   "err-phone",   "El teléfono es obligatorio.");
        check("edit-email",   "err-email",   "El email es obligatorio.");

        const price = parseFloat(document.getElementById("edit-price").value);
        const errPrice = document.getElementById("err-price");
        if (isNaN(price) || price <= 0) { errPrice.textContent = "Introduce un precio válido."; valid = false; }
        else errPrice.textContent = "";

        if (!valid) return;

        // Guardar en localStorage
        const result = {
            name:       document.getElementById("edit-name").value.trim(),
            address:    document.getElementById("edit-address").value.trim(),
            phone:      document.getElementById("edit-phone").value.trim(),
            email:      document.getElementById("edit-email").value.trim(),
            price:      price,
            rating:     parseFloat(document.getElementById("edit-rating").value) || (base ? base.rating : 0),
            delivery:   document.getElementById("edit-delivery").value.trim(),
            category:   document.getElementById("edit-category").value,
            categories: tags,
            bike:       document.getElementById("edit-bike").checked,
            menu:       menu,
            image:      base ? base.image : ""
        };

        localStorage.setItem(storageKey, JSON.stringify(result));

        // Mostrar toast
        const toast = document.getElementById("save-toast");
        toast.classList.add("toast-visible");
        setTimeout(() => toast.classList.remove("toast-visible"), 3000);
    });

    // ── Cancelar ──
    document.getElementById("cancel-btn").addEventListener("click", () => {
        history.back();
    });

    // ── Botón volver ──
    document.getElementById("back-btn").addEventListener("click", () => {
        history.back();
    });
}


