const RESTAURANTS = [
    {
        name: "Pizza Napoli", image: "../assets/italiano.png", rating: 4.5,
        delivery: "30-40 min", deliveryMax: 40, category: "pizza",
        address: "Calle Principal 1, Mérida", phone: "924000001",
        email: "info@pizzanapoli.com", price: 12,
        categories: ["Pizza", "Italiana"], bike: true,
        menu: [
            {name: "Pizza Margherita", desc: "Tomate, mozzarella, albahaca", price: 8.50},
            {name: "Pizza Pepperoni", desc: "Pepperoni, queso extra", price: 10.50}
        ]
    },
    {
        name: "Pide et Impera", image: "../assets/burg.png", rating: 4.2,
        delivery: "35-45 min", deliveryMax: 45, category: "pizza",
        address: "Calle Secundaria 5, Mérida", phone: "924000002",
        email: "info@pideetimpera.com", price: 14,
        categories: ["Pizza", "Italiana"], bike: true,
        menu: [
            {name: "Pizza Romana", desc: "Aceitunas, anchoas, orégano", price: 9.50},
            {name: "Pizza César", desc: "Pollo, queso parmesano", price: 11.00}
        ]
    },
    {
        name: "Los 300 del Tupper", image: "../assets/susi.png", rating: 4.8,
        delivery: "20-30 min", deliveryMax: 30, category: "sushi",
        address: "Avenida de Grecia 10, Mérida", phone: "924000003",
        email: "contacto@los300tupper.com", price: 25,
        categories: ["Sushi", "Japonesa"], bike: true,
        menu: [
            {name: "Sushi Especial 300", desc: "30 piezas variadas", price: 18.50},
            {name: "Maki Roll", desc: "Rollo de salmón y aguacate", price: 12.00},
            {name: "Sashimi Deluxe", desc: "Selección premium de sashimi", price: 22.00}
        ]
    },
    {
        name: "El Senado del Sushi", image: "../assets/rumano.png", rating: 4.7,
        delivery: "25-35 min", deliveryMax: 35, category: "sushi",
        address: "Calle del Senado 3, Mérida", phone: "924000004",
        email: "info@senadosushi.com", price: 28,
        categories: ["Sushi", "Japonesa"], bike: false,
        menu: [
            {name: "Sushi Imperial", desc: "Selección del chef", price: 22.00},
            {name: "Temaki Salmón", desc: "Cucurucho de alga con salmón", price: 9.50}
        ]
    },
    {
        name: "Apuntes & Arepas", image: "../assets/burgui.png", rating: 4.3,
        delivery: "25-35 min", deliveryMax: 35, category: "burgers",
        address: "Calle de los Estudiantes 7, Mérida", phone: "924000005",
        email: "hola@apuntesyarepas.com", price: 12,
        categories: ["Venezolana", "Arepas"], bike: true,
        menu: [
            {name: "Arepa Reina Pepiada", desc: "Pollo, aguacate, mayonesa", price: 5.50},
            {name: "Arepa Pabellón", desc: "Carne, plátano, queso", price: 6.50}
        ]
    },
    {
        name: "Gladiator Burger", image: "../assets/bagg.png", rating: 4.1,
        delivery: "20-30 min", deliveryMax: 30, category: "burgers",
        address: "Coliseo Plaza 2, Mérida", phone: "924000006",
        email: "info@gladiatorburger.com", price: 14,
        categories: ["Burger", "Americana"], bike: true,
        menu: [
            {name: "Gladiator Burger", desc: "Doble carne, queso, bacon", price: 11.50},
            {name: "Patatas Gladiador", desc: "Con salsa especial", price: 4.50}
        ]
    },
    {
        name: "Tesis & Tacos", image: "../assets/tacos.png", rating: 4.6,
        delivery: "20-25 min", deliveryMax: 25, category: "mexicana",
        address: "Calle Universidad 15, Mérida", phone: "924000007",
        email: "contacto@tesistacos.com", price: 10,
        categories: ["Mexicana", "Tacos"], bike: true,
        menu: [
            {name: "Tacos al Pastor", desc: "3 tacos con piña", price: 6.50},
            {name: "Quesadillas", desc: "Con queso y tu elección de carne", price: 5.50},
            {name: "Guacamole", desc: "Aguacate, tomate, cebolla, limón", price: 4.00}
        ]
    },
    {
        name: "El Burrito", image: "../assets/pingu.png", rating: 4.4,
        delivery: "25-30 min", deliveryMax: 30, category: "mexicana",
        address: "Plaza México 4, Mérida", phone: "924000008",
        email: "info@elburrito.com", price: 12,
        categories: ["Mexicana", "Burritos"], bike: false,
        menu: [
            {name: "Burrito Grande", desc: "Carne, frijoles, arroz, queso", price: 9.50},
            {name: "Nachos Supreme", desc: "Con guacamole y queso", price: 7.00}
        ]
    }
];

// leer ?id= de la URL
function getUrlId() {
    return parseInt(new URLSearchParams(window.location.search).get("id"));
}

// obtener restaurante por id
function getRestaurant(id) {
    const base = RESTAURANTS[id] || null;
    const raw = localStorage.getItem(`cumeats_edit_${id}`);
    const saved = raw ? JSON.parse(raw) : null;
    return saved || base || null;
}

document.addEventListener("DOMContentLoaded", function () {

    inicioLogeo();
    inicioRegis();
    ocultarContra();
    busquedaHome();
    busquedaAutocomplete();
    initRestaurantCards();
    cargaDetalles();
    editarRest();
    startSloganRotation();

});

function busquedaHome() {
    const btn = document.getElementById("hero-search-btn");
    const input = document.getElementById("hero-search");
    if (!btn || !input) return;

    function doSearch() {
        const query = input.value.trim();
        const list = document.getElementById("autocomplete-list");
        if (list) list.innerHTML = "";
        window.location.href = query
            ? "restaurantes.html?buscar=" + encodeURIComponent(query)
            : "restaurantes.html";
    }

    btn.addEventListener("click", doSearch);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") doSearch();
    });
}


// Autocompletado
function busquedaAutocomplete() {
    const input = document.getElementById("hero-search");
    const list = document.getElementById("autocomplete-list");
    if (!input || !list) return;

    const wrapper = input.closest(".autocomplete-wrapper");

    const SUGGESTIONS = [
        "Mérida",
        "Calle Principal, Mérida", "Avenida de Grecia, Mérida",
        "Calle Universidad, Mérida", "Plaza México, Mérida",
        "Calle del Senado, Mérida", "Coliseo Plaza, Mérida",
        ...RESTAURANTS.map(r => r.name)
    ];

    function closeList() {
        list.innerHTML = "";
        list.hidden = true;
        wrapper && wrapper.classList.remove("open");
    }

    input.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        closeList();
        if (query.length < 2) return;

        const matches = SUGGESTIONS.filter(s => s.toLowerCase().includes(query)).slice(0, 6);
        if (!matches.length) return;

        matches.forEach(match => {
            const li = document.createElement("li");
            li.className = "autocomplete-item";
            const idx = match.toLowerCase().indexOf(query);
            li.innerHTML = match.slice(0, idx) + `<strong>${match.slice(idx, idx + query.length)}</strong>` + match.slice(idx + query.length);
            li.addEventListener("mousedown", e => {
                e.preventDefault();
                input.value = match;
                closeList();
                window.location.href = "restaurantes.html?buscar=" + encodeURIComponent(match);
            });
            list.appendChild(li);
        });

        wrapper && wrapper.classList.add("open");
        list.hidden = false;
    });

    input.addEventListener("blur", () => setTimeout(closeList, 150));

    input.addEventListener("keydown", function (e) {
        const items = list.querySelectorAll(".autocomplete-item");
        let active = list.querySelector(".autocomplete-item.active");

        if (e.key === "ArrowDown") {
            e.preventDefault();
            active ? (active.classList.remove("active"), (active.nextElementSibling || items[0]).classList.add("active"))
                : items[0]?.classList.add("active");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            active ? (active.classList.remove("active"), (active.previousElementSibling || items[items.length - 1]).classList.add("active"))
                : items[items.length - 1]?.classList.add("active");
        } else if (e.key === "Enter" && active) {
            e.preventDefault();
            input.value = active.textContent;
            closeList();
            window.location.href = "restaurantes.html?buscar=" + encodeURIComponent(input.value.trim());
        } else if (e.key === "Escape") {
            closeList();
        }
    });
}


// Validaciones de formularios
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(errId, msg, input, ok = false) {
    const span = document.getElementById(errId);
    if (span) span.textContent = msg;
    if (input) {
        input.classList.toggle("input-invalid", !ok && msg !== "");
        input.classList.toggle("input-valid", ok);
    }
    return ok;
}

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



function inicioLogeo() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");

    emailInput.addEventListener("blur", () => validateLoginEmail());
    passInput.addEventListener("blur", () => validateLoginPass());
    emailInput.addEventListener("input", () => setError("err-login-email", "", emailInput));
    passInput.addEventListener("input", () => setError("err-login-password", "", passInput));

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateLoginEmail() | !validateLoginPass()) return;

        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn && submitBtn.classList.add("btn-loading");

        setTimeout(() => {
            localStorage.setItem("cumeatsUser", JSON.stringify({email: emailInput.value.trim()}));
            submitBtn && submitBtn.classList.remove("btn-loading");
            showToastGlobal("✅ Sesión iniciada correctamente");
            setTimeout(() => window.location.href = "inicio.html", 1200);
        }, 800);
    });

    function validateLoginEmail() {
        const v = emailInput.value.trim();
        if (!v) return setError("err-login-email", "El email es obligatorio.", emailInput);
        if (!isValidEmail(v)) return setError("err-login-email", "Introduce un email válido.", emailInput);
        return setError("err-login-email", "", emailInput, true);
    }

    function validateLoginPass() {
        const v = passInput.value;
        if (!v) return setError("err-login-password", "La contraseña es obligatoria.", passInput);
        if (v.length < 8) return setError("err-login-password", "Mínimo 8 caracteres.", passInput);
        return setError("err-login-password", "", passInput, true);
    }
}


function inicioRegis() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const f = {
        name: document.getElementById("reg-name"),
        surname: document.getElementById("reg-surname"),
        phone: document.getElementById("reg-phone"),
        email: document.getElementById("reg-email"),
        password: document.getElementById("reg-password"),
        confirm: document.getElementById("reg-confirm"),
    };

    Object.entries(f).forEach(([k, el]) => {
        el.addEventListener("blur", () => validators[k]());
        el.addEventListener("input", () => setError("err-reg-" + k, "", el));
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const ok = Object.keys(validators).map(k => validators[k]());
        if (ok.includes(false)) return;

        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn && submitBtn.classList.add("btn-loading");

        setTimeout(() => {
            localStorage.setItem("cumeatsUser", JSON.stringify({
                name: f.name.value.trim() + " " + f.surname.value.trim(),
                email: f.email.value.trim(),
                phone: f.phone.value.trim()
            }));
            submitBtn && submitBtn.classList.remove("btn-loading");
            showToastGlobal("✅ Cuenta creada correctamente");
            setTimeout(() => window.location.href = "inicio.html", 1200);
        }, 900);
    });

    const validators = {
        name() {
            const v = f.name.value.trim();
            if (!v) return setError("err-reg-name", "El nombre es obligatorio.", f.name);
            if (v.length < 2) return setError("err-reg-name", "Mínimo 2 caracteres.", f.name);
            return setError("err-reg-name", "", f.name, true);
        },
        surname() {
            const v = f.surname.value.trim();
            if (!v) return setError("err-reg-surname", "Los apellidos son obligatorios.", f.surname);
            if (v.length < 2) return setError("err-reg-surname", "Mínimo 2 caracteres.", f.surname);
            return setError("err-reg-surname", "", f.surname, true);
        },
        phone() {
            const v = f.phone.value.trim();
            if (!v) return setError("err-reg-phone", "El teléfono es obligatorio.", f.phone);
            if (!/^[6-9]\d{8}$/.test(v)) return setError("err-reg-phone", "Formato no válido (ej: 612345678).", f.phone);
            return setError("err-reg-phone", "", f.phone, true);
        },
        email() {
            const v = f.email.value.trim();
            if (!v) return setError("err-reg-email", "El email es obligatorio.", f.email);
            if (!isValidEmail(v)) return setError("err-reg-email", "Introduce un email válido.", f.email);
            return setError("err-reg-email", "", f.email, true);
        },
        password() {
            const v = f.password.value;
            if (!v) return setError("err-reg-password", "La contraseña es obligatoria.", f.password);
            if (v.length < 8) return setError("err-reg-password", "Mínimo 8 caracteres.", f.password);
            if (!/[A-Z]/.test(v)) return setError("err-reg-password", "Debe contener al menos una mayúscula.", f.password);
            if (!/[a-z]/.test(v)) return setError("err-reg-password", "Debe contener al menos una minúscula.", f.password);
            if (!/\d/.test(v)) return setError("err-reg-password", "Debe contener al menos un número.", f.password);
            if (!/[^A-Za-z0-9]/.test(v)) return setError("err-reg-password", "Debe contener al menos un carácter especial.", f.password);
            return setError("err-reg-password", "", f.password, true);
        },
        confirm() {
            const v = f.confirm.value;
            if (!v) return setError("err-reg-confirm", "Confirma tu contraseña.", f.confirm);
            if (v !== f.password.value) return setError("err-reg-confirm", "Las contraseñas no coinciden.", f.confirm);
            return setError("err-reg-confirm", "", f.confirm, true);
        },
    };
}


function ocultarContra() {
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", function () {
            const input = document.getElementById(this.dataset.target || "password");
            if (!input) return;
            input.type = input.type === "password" ? "text" : "password";
            this.textContent = input.type === "password" ? "👁" : "👁";
        });
    });
}

function initRestaurantCards() {
    const container = document.getElementById("restaurants-grid");
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const state = {
        search: urlParams.get("buscar") || "",
        categoria: urlParams.get("categoria") || "todas",
        precioMax: 30,
        ratingMin: 0,
        fastDelivery: false,
        bike: false
    };

    const el = {
        title: document.getElementById("category-title"),
        count: document.getElementById("results-count"),
        search: document.getElementById("search-input"),
        priceRange: document.getElementById("price-range"),
        priceLabel: document.getElementById("price-display"),
        fastCheck: document.getElementById("fast-delivery"),
        bikeCheck: document.getElementById("bike-friendly"),
        clearBtn: document.getElementById("clear-all-filters"),
        catBtns: document.querySelectorAll(".filter-cat"),
        ratingBtns: document.querySelectorAll(".filter-rating"),
    };

    // Inicializar UI con estado de URL
    el.catBtns.forEach(b => b.classList.toggle("active", b.dataset.cat === state.categoria));
    if (el.search && state.search) el.search.value = state.search;


    function renderCards() {
        const CAT_LABELS = {   todas: "Todos los restaurantes",
                                    pizza: "🍕 Pizza",
                                    burgers: "🍔 Burgers",
                                    sushi: "🍣 Sushi",
                                    mexicana: "🌮 Mexicana" };
        const q = state.search.toLowerCase();

        const lista = RESTAURANTS.map((_, idx) => ({ r: getRestaurant(idx), idx })).filter(({ r }) =>
            r
            && (!q || r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.categories.some(c => c.toLowerCase().includes(q)))
            && (state.categoria === "todas" || r.category === state.categoria)
            && r.price <= state.precioMax
            && r.rating >= state.ratingMin
            && (!state.fastDelivery || (r.deliveryMax ?? 99) <= 30)
            && (!state.bike || r.bike === true)
        );

        if (el.title) el.title.textContent = CAT_LABELS[state.categoria] || "Restaurantes";
        if (el.count) el.count.textContent = lista.length + " resultado" + (lista.length !== 1 ? "s" : "");

        container.innerHTML = lista.length === 0
            ? "<p class='no-results'>No hay restaurantes que coincidan con los filtros.</p>"
            : lista.map(({ r, idx }) => {
                const priceDots = r.price <= 10 ? "€" : r.price <= 20.67 ? "€€" : "€€€";
                return `
                <div class="restaurant-card" onclick="window.location.href='detalles.html?id=${idx}'">
                    <img src="${r.image}" alt="${r.name}">
                    <div class="card-body">
                        <h3>${r.name}</h3>
                        <div class="card-meta">
                            <span class="card-rating">⭐ ${r.rating}</span>
                            <span class="card-sep">·</span>
                            <span class="card-time">${r.delivery}</span>
                            <span class="card-sep">·</span>
                            <span class="card-price">${priceDots} -- ${r.price}€ pedido mín.</span>
                        </div>
                        <div class="card-tags">
                            ${r.categories.map(c => `<span class="card-tag">${c}</span>`).join("")}
                            ${r.bike ? '<span class="card-tag bike">🚲 Bike</span>' : ""}
                        </div>
                        <p class="card-address">${r.address}</p>
                    </div>
                </div>`;
            }).join("");
    }

    //filtros
    el.search && el.search.addEventListener("input", () => {
        state.search = el.search.value;
        renderCards();
    });
    el.priceRange && el.priceRange.addEventListener("input", () => {
        state.precioMax = +el.priceRange.value;
        if (el.priceLabel) el.priceLabel.textContent = el.priceRange.value + "€";
        renderCards();
    });
    el.fastCheck && el.fastCheck.addEventListener("change", () => {
        state.fastDelivery = el.fastCheck.checked;
        renderCards();
    });
    el.bikeCheck && el.bikeCheck.addEventListener("change", () => {
        state.bike = el.bikeCheck.checked;
        renderCards();
    });

    el.catBtns.forEach(b => b.addEventListener("click", () => {
        state.categoria = b.dataset.cat;
        el.catBtns.forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        renderCards();
    }));

    el.ratingBtns.forEach(b => b.addEventListener("click", () => {
        state.ratingMin = parseFloat(b.dataset.min);
        el.ratingBtns.forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        renderCards();
    }));

    el.clearBtn && el.clearBtn.addEventListener("click", () => {
        state.search = "";
        state.categoria = "todas";
        state.precioMax = 30;
        state.ratingMin = 0;
        state.fastDelivery = false;
        state.bike = false;
        if (el.search) el.search.value = "";
        if (el.priceRange) {
            el.priceRange.value = 30;
            el.priceLabel.textContent = "30€";
        }
        if (el.fastCheck) el.fastCheck.checked = false;
        if (el.bikeCheck) el.bikeCheck.checked = false;
        el.catBtns.forEach(b => b.classList.toggle("active", b.dataset.cat === "todas"));
        el.ratingBtns.forEach(b => b.classList.toggle("active", b.dataset.min === "0"));
        renderCards();
    });

    renderCards();
}


// Slogan rotatorio
const slogans = [
    "Pide facil. Come mejor.", "Hoy cocinan otros por ti 😎",
    "Tu antojo empieza aqui", "Mas rapido que cocinar",
    "La dieta empieza mañana", "Tu recompensa por ese 5",
    "Curso de cocina? pa que", "Sushi o pizza, losh dosh",
    "Cocinar es de graduados", "Estudiar da hambre",
    "Te has quedado sin tupers?", "Elige no morir de hambre",
    "Subelo en tiktok, 5 likes", "Cafe con lejia?",
    "Cafe y cigarro...", "Tu abuela esta triste",
    "La cabra pide aqui", "AMA Gang"
];
let sloganIndex = 0;

function startSloganRotation() {
    const el = document.getElementById("dynamic-slogan");
    if (!el) return;
    setInterval(() => {
        el.classList.add("fade");
        setTimeout(() => {
            sloganIndex = (sloganIndex + 1) % slogans.length;
            el.textContent = slogans[sloganIndex];
            el.classList.remove("fade");
            el.classList.add("slogan-enter");
            el.getBoundingClientRect(); // forzar reflow
            el.classList.remove("slogan-enter");
        }, 420);
    }, 3000);
}


// Detalle de restaurante
function cargaDetalles() {
    const nameEl = document.getElementById("restaurantName");
    if (!nameEl) return;

    const id = getUrlId();
    const r = getRestaurant(id);

    if (!r) {
        nameEl.textContent = "Restaurante no encontrado";
        return;
    }

    document.title = r.name + " | CUMEats";
    nameEl.textContent = r.name;
    document.getElementById("restaurantAddress").textContent = r.address;
    document.getElementById("restaurantPhone").textContent = r.phone;
    document.getElementById("restaurantEmail").textContent = r.email;
    document.getElementById("restaurantPrice").textContent = r.price;
    document.getElementById("restaurantCategories").textContent = r.categories.join(", ");
    document.getElementById("restaurantRating").textContent = r.rating;
    document.getElementById("restaurantBike").textContent = r.bike ? "✅ Sí" : "❌ No";

    const editLink = document.getElementById("edit-link");
    if (editLink) editLink.href = `edicion_rest.html?id=${id}`;

    const menuContainer = document.getElementById("menuContainer");
    if (menuContainer && r.menu) {
        menuContainer.innerHTML = r.menu.map(item => `
            <div class="menu-item">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="menu-price">${item.price.toFixed(2)} €</span>
            </div>`).join("");
    }

    document.querySelector(".back-btn")?.addEventListener("click", () => {
        window.location.href = "restaurantes.html";
    });
}


// Edición de restaurante
function editarRest() {
    const form = document.getElementById("edit-form");
    if (!form) return;

    const id   = getUrlId();
    const base = RESTAURANTS[id] || null;
    const data = getRestaurant(id) || { name:"", address:"", phone:"", email:"", price:"", rating:"", delivery:"", category:"pizza", categories:[], bike:false, menu:[] };

    // Rellenar campos de texto simples
    ["name","phone","email","price","rating","delivery"].forEach(k => {
        const el = document.getElementById("edit-" + k);
        if (el) el.value = data[k] || "";
    });
    // Textarea de dirección
    const addressEl = document.getElementById("edit-address");
    if (addressEl) addressEl.value = data.address || "";

    // Radio buttons Bike Friendly
    const bikeValue = data.bike ? "yes" : "no";
    const bikeRadio = form.querySelector(`input[name="bike"][value="${bikeValue}"]`);
    if (bikeRadio) bikeRadio.checked = true;

    // Checkboxes de categorías
    const savedCategories = Array.isArray(data.categories) ? data.categories.map(c => c.toLowerCase()) : [];
    form.querySelectorAll('input[name="categoria"]').forEach(cb => {
        cb.checked = savedCategories.includes(cb.value.toLowerCase());
    });

    if (base) document.title = `Editar: ${base.name} | CUMEats`;


    // Platos
    let menu = Array.isArray(data.menu) ? [...data.menu] : [];

    function renderDishes() {
        const list = document.getElementById("dish-list");
        const emptyMsg = document.getElementById("empty-menu-msg");
        emptyMsg.style.display = menu.length === 0 ? "block" : "none";

        list.innerHTML = menu.map((dish, i) => `
            <div class="dish-row">
                <div class="dish-row-info">
                    <span class="dish-row-name">${dish.name}</span>
                    <span class="dish-row-desc">${dish.desc}</span>
                </div>
                <span class="dish-row-price">${parseFloat(dish.price).toFixed(2)} €</span>
                <div class="dish-row-actions">
                    <button type="button" class="btn-dish-edit" data-i="${i}" title="Editar">✏️</button>
                    <button type="button" class="btn-dish-del"  data-i="${i}" title="Eliminar">🗑️</button>
                </div>
            </div>`).join("");

        list.querySelectorAll(".btn-dish-del").forEach(btn =>
            btn.addEventListener("click", () => {
                menu.splice(+btn.dataset.i, 1);
                renderDishes();
            })
        );
        list.querySelectorAll(".btn-dish-edit").forEach(btn =>
            btn.addEventListener("click", () => {
                const i = +btn.dataset.i;
                document.getElementById("dish-name").value = menu[i].name;
                document.getElementById("dish-desc").value = menu[i].desc;
                document.getElementById("dish-price").value = menu[i].price;
                const addBtn = document.getElementById("add-dish-btn");
                addBtn.textContent = "💾 Actualizar plato";
                addBtn.dataset.editIndex = i;
                document.getElementById("dish-name").focus();
            })
        );
    }

    renderDishes();

    document.getElementById("add-dish-btn").addEventListener("click", function () {
        const errDish = document.getElementById("err-dish");
        const nameVal = document.getElementById("dish-name").value.trim();
        const priceVal = parseFloat(document.getElementById("dish-price").value);
        const descVal = document.getElementById("dish-desc").value.trim();

        if (!nameVal) {
            errDish.textContent = "El nombre del plato es obligatorio.";
            return;
        }
        if (isNaN(priceVal) || priceVal < 0) {
            errDish.textContent = "Introduce un precio válido.";
            return;
        }
        errDish.textContent = "";

        const editIdx = this.dataset.editIndex;
        if (editIdx !== undefined && editIdx !== "") {
            menu[+editIdx] = {name: nameVal, desc: descVal, price: priceVal};
            delete this.dataset.editIndex;
            this.textContent = "＋ Añadir plato";
        } else {
            menu.push({name: nameVal, desc: descVal, price: priceVal});
        }
        ["dish-name", "dish-desc", "dish-price"].forEach(id => document.getElementById(id).value = "");
        renderDishes();
    });

    // Validación y guardado
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let valid = true;

        const nameEl = document.getElementById("edit-name");
        if (!nameEl.value.trim()) {
            document.getElementById("err-name").textContent = "El nombre es obligatorio.";
            nameEl.classList.add("input-error");
            valid = false;
        } else {
            document.getElementById("err-name").textContent = "";
            nameEl.classList.remove("input-error");
        }

        const addressEl = document.getElementById("edit-address");
        if (!addressEl.value.trim()) {
            document.getElementById("err-address").textContent = "La dirección es obligatoria.";
            addressEl.classList.add("input-error");
            valid = false;
        } else {
            document.getElementById("err-address").textContent = "";
            addressEl.classList.remove("input-error");
        }

        const phoneEl = document.getElementById("edit-phone");
        if (!phoneEl.value.trim()) {
            document.getElementById("err-phone").textContent = "El teléfono es obligatorio.";
            phoneEl.classList.add("input-error");
            valid = false;
        } else {
            document.getElementById("err-phone").textContent = "";
            phoneEl.classList.remove("input-error");
        }

        const emailEl = document.getElementById("edit-email");
        if (!emailEl.value.trim()) {
            document.getElementById("err-email").textContent = "El email es obligatorio.";
            emailEl.classList.add("input-error");
            valid = false;
        } else {
            document.getElementById("err-email").textContent = "";
            emailEl.classList.remove("input-error");
        }

        const price = parseFloat(document.getElementById("edit-price").value);
        const errPrice = document.getElementById("err-price");
        if (isNaN(price) || price <= 0) { errPrice.textContent = "Introduce un precio válido."; valid = false; }
        else errPrice.textContent = "";

        if (!valid) return;

        const saveBtn = form.querySelector(".btn-save");
        saveBtn && saveBtn.classList.add("btn-loading");

        setTimeout(() => {
            const val = id => document.getElementById(id)?.value.trim();
            const selectedCategories = [...form.querySelectorAll('input[name="categoria"]:checked')].map(cb => cb.value);
            const bikeChecked = form.querySelector('input[name="bike"]:checked')?.value === "yes";
            const result = {
                name: val("edit-name"), address: val("edit-address"),
                phone: val("edit-phone"), email: val("edit-email"),
                delivery: val("edit-delivery"),
                category: selectedCategories[0] || (base?.category ?? ""),
                price, rating: parseFloat(val("edit-rating")) || (base?.rating ?? 0),
                bike: bikeChecked,
                categories: selectedCategories, menu, image: base?.image ?? ""
            };
            localStorage.setItem(`cumeats_edit_${isNaN(id) ? "new" : id}`, JSON.stringify(result));
            saveBtn && saveBtn.classList.remove("btn-loading");
            const toast = document.getElementById("save-toast");
            toast.classList.add("toast-visible");
            setTimeout(() => {
                toast.classList.remove("toast-visible");
                window.location.href = isNaN(id) ? "restaurantes.html" : `detalles.html?id=${id}`;
            }, 1200);
        }, 700);
    });

    document.getElementById("cancel-btn")?.addEventListener("click", () => history.back());
    document.getElementById("back-btn")?.addEventListener("click", () => {
        window.location.href = isNaN(id) ? "restaurantes.html" : `detalles.html?id=${id}`;
    });
}
