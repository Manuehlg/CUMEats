# Funcionalidades añadidas — CUMEats

---

## 1. Slogans rotativos
**Dónde:** `js/app.js` → función `startSloganRotation()` · `html/inicio.html` → `#dynamic-slogan` · `css/styles.css` → clases `.fade` y `.slogan-enter`

Cada 3 segundos el subtítulo del header cambia a uno de los slogans del array `slogans`. El cambio tiene una animación y desaparece (`.fade`), y el nuevo entra desde abajo (`.slogan-enter`).

---

## 2. Loader en el filtrado de restaurantes
**Dónde:** `js/app.js` → funciones `showSkeletons()` y `showLoader()` dentro de `initRestaurantCards()` · `css/styles.css` → clases `.skeleton-card`, `.loading-overlay`, `.spinner`

Cuando el usuario cambia cualquier filtro, en lugar de actualizar el grid de golpe se muestra una animacion simulando una carga. Aparece también un spinner con el texto "Buscando restaurantes…". Al terminar el timeout se muestran las tarjetas (cards). 

---

## 3. Edición y eliminación de platos en la ficha de edición
**Dónde:** `js/app.js` → función `renderDishes()` e `initEditRestaurant()` · `html/edicion_rest.html` → sección `#dish-list` y formulario `#add-dish-btn` · `css/styles.css` → clases `.dish-row`, `.btn-dish-edit`, `.btn-dish-del`

En la página de edición de un restaurante, cada plato del menú muestra dos botones: ✏️ edita y 🗑️ elimina. Al pulsar editar, los datos del plato (nombre, descripción, precio) se cargan en el formulario de añadir plato y el botón cambia a "💾 Actualizar plato"; al guardar, sobreescribe el plato. Si no hay platos se muestra un mensaje vacío.
