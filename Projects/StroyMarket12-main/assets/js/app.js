// Shared helpers
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Navigation active state
function initNavigation() {
    const current = document.body.dataset.page;
    $$(".nav-link").forEach(link => {
        const target = link.getAttribute("href");
        if (target && current && target.includes(current)) {
            link.classList.add("active");
        }
    });
}

// Проверка авторизации в навигации
function updateNavigationAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navMenu = $('.nav-menu');
    
    if (!navMenu) return;
    
    // Удаляем старые кнопки профиля
    $$('.profile-link, .logout-link').forEach(el => el.remove());
    
    // Удаляем старую ссылку на избранное
    $$('.nav-link[href="favorites.html"]').forEach(el => el.remove());
    
    if (isLoggedIn) {
        const userName = localStorage.getItem('userName') || 'Профиль';
        
        // Добавляем ссылку на избранное
        const favoritesLink = document.createElement('a');
        favoritesLink.href = 'favorites.html';
        favoritesLink.className = 'nav-link';
        favoritesLink.textContent = 'Избранное';
        navMenu.insertBefore(favoritesLink, navMenu.querySelector('.order-btn'));
        
        // Добавляем кнопку профиля
        const profileBtn = document.createElement('a');
        profileBtn.href = 'profile.html';
        profileBtn.className = 'order-btn profile-link';
        profileBtn.textContent = userName;
        navMenu.appendChild(profileBtn);
    }
}

// Добавляем кнопки избранного в карточки товаров
function addFavoriteButtons() {
    const productCards = $$('.product-card');
    
    productCards.forEach(card => {
        const productId = card.querySelector('.product-order-btn')?.dataset?.id;
        if (!productId) return;
        
        // Проверяем, есть ли уже кнопка
        if (card.querySelector('.favorite-btn')) return;
        
        const isFavorite = JSON.parse(localStorage.getItem('favorites') || '[]').includes(productId);
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn ${isFavorite ? 'active' : ''}`;
        favoriteBtn.innerHTML = isFavorite ? '❤️' : '🤍';
        favoriteBtn.setAttribute('data-id', productId);
        favoriteBtn.onclick = function() {
            toggleFavorite(productId, this);
        };
        
        const imgContainer = card.querySelector('.product-image')?.parentElement;
        if (imgContainer) {
            imgContainer.style.position = 'relative';
            imgContainer.insertBefore(favoriteBtn, imgContainer.firstChild);
        }
    });
}

// Переключение избранного
function toggleFavorite(productId, button) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Пожалуйста, войдите в систему, чтобы добавлять товары в избранное');
        window.location.href = 'login.html';
        return;
    }
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.innerHTML = '🤍';
    } else {
        favorites.push(productId);
        button.classList.add('active');
        button.innerHTML = '❤️';
        
        // Анимация
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = 'heartBeat 0.5s';
        }, 10);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Hero slider (home page)
function initHeroSlider() {
    const slides = $$(".hero-slide");
    const indicators = $$(".slide-indicator");
    if (!slides.length) return;

    let currentSlide = 0;

    function showSlide(idx) {
        slides.forEach(s => s.classList.remove("active"));
        indicators.forEach(i => i.classList.remove("active"));
        currentSlide = idx;
        slides[currentSlide].classList.add("active");
        indicators[currentSlide]?.classList.add("active");
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    indicators.forEach((btn, idx) => btn.addEventListener("click", () => showSlide(idx)));
    setInterval(nextSlide, 5000);
}

// Product catalogue data
// Product catalogue data
const products = [
    { 
        id: "bosch-drill", 
        name: "Дрель ударная BOSCH GBH 2-26 DFR", 
        price: 8499, 
        category: "instruments", 
        tag: "Инструменты", 
        img: "assets/img/image 13-no-bg-preview (carve.photos).png" 
    },
    { 
        id: "paint-white", 
        name: "Краска водоэмульсионная белая", 
        price: 1850, 
        category: "paints", 
        tag: "Материалы", 
        img: "assets/img/pwWJjNzD7FUU7RH08V-qRpQdbWvGLBLijzfoyxNXQcq73Xb_On-no-bg-preview (carve.photos).png" 
    },
    { 
        id: "laser-level", 
        name: "Уровень лазерный 360°", 
        price: 5990, 
        category: "instruments", 
        tag: "Инструменты", 
        img: "assets/img/i-no-bg-preview (carve.photos) (1).png" 
    },
    { 
        id: "tile-30", 
        name: "Плитка керамическая 30×30", 
        price: 850, 
        category: "materials", 
        tag: "Отделочные материалы", 
        img: "assets/img/pwWJjNzD7FUU7RH08V-qRpQdbWvGLBLijzfoy0JWQ8643SzxOn-no-bg-preview (carve.photos).png" 
    },
    { 
        id: "plaster", 
        name: "Штукатурка гипсовая 30 кг", 
        price: 420, 
        category: "mixes", 
        tag: "Строительные смеси", 
        img: "assets/img/pwWJjNzD7FUU7RH08V-qRpQdbWvGLBLijzfoyUdTR87q2HH_b3-no-bg-preview (carve.photos).png" 
    },
    { 
        id: "sink", 
        name: "Раковина накладная 50×40 см", 
        price: 3750, 
        category: "sanitary", 
        tag: "Сантехника", 
        img: "assets/img/pwWJjNzD7FUU7RH08V-qRpQdbWvGLBLijzfomk1fE8nojyH3b3GInOOBBrNGaOUOc-xhM4k9yaDxyatxcZW0dbIAxMCag_IOSKgJoPlcr0SJQC562nYWv5V1tJUFXR_Hvd1KmB0IrKWZsiqWbUD9WXm4Zy7Ceo3Llw.webp" 
    },
    { 
        id: "extension", 
        name: "Удлинитель линейный 380 градусов", 
        price: 5990, 
        category: "electricity", 
        tag: "Электрика", 
        img: "assets/img/109210635.jpg" 
    },
    { 
        id: "cleaner", 
        name: "Очиститель для ванны", 
        price: 3250, 
        category: "sanitary", 
        tag: "Сантехника", 
        img: "assets/img/6786483837.jpg" 
    },
    { 
        id: "led-strip", 
        name: "Светодиодная лента 10м", 
        price: 250, 
        category: "electricity", 
        tag: "Электрика", 
        img: "assets/img/orig-no-bg-preview (carve.photos).png" 
    }
];

const cartKey = "stroy-market-cart";

function loadCart() {
    try {
        const saved = localStorage.getItem(cartKey);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
        return new Set();
    }
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(Array.from(cart)));
}

// Render catalogue
function initCatalogPage() {
    const grid = $(".products-full-grid");
    if (!grid) return;

    const searchInput = $(".search-input");
    const categoryButtons = $$(".category-item");
    const cart = loadCart();
    let activeCategory = "all";

    function formatPrice(num) {
        return num.toLocaleString("ru-RU") + " ₽";
    }

    function getFiltered() {
        const term = searchInput?.value.toLowerCase() || "";
        return products.filter(p => {
            const matchesCategory = activeCategory === "all" || p.category === activeCategory;
            const matchesTerm = !term || p.name.toLowerCase().includes(term);
            return matchesCategory && matchesTerm;
        });
    }

    function render() {
        const list = getFiltered();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        grid.innerHTML = list.map(p => `
            <div class="product-card" data-id="${p.id}">
                <div style="position: relative;">
                    <button class="favorite-btn ${favorites.includes(p.id) ? 'active' : ''}" 
                            data-id="${p.id}"
                            onclick="toggleFavorite('${p.id}', this)">
                        ${favorites.includes(p.id) ? '❤️' : '🤍'}
                    </button>
                    <img src="${p.img}" alt="${p.name}" class="product-image">
                    <div class="product-tag">${p.tag}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <div class="product-price">${formatPrice(p.price)}</div>
                    <button class="product-order-btn ${cart.has(p.id) ? "in-cart" : ""}" data-action="cart" data-id="${p.id}">
                        ${cart.has(p.id) ? "В корзине" : "Заказать"}
                    </button>
                </div>
            </div>
        `).join("");
    }

    // Category filter
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.category || "all";
            render();
        });
    });

    // Search
    searchInput?.addEventListener("input", render);

    // Cart toggles
    grid.addEventListener("click", e => {
        const target = e.target;
        if (target instanceof HTMLElement && target.dataset.action === "cart") {
            const id = target.dataset.id;
            if (cart.has(id)) {
                cart.delete(id);
            } else {
                cart.add(id);
            }
            saveCart(cart);
            render();
        }
    });

    render();
}

// Popular products on home page share cart state
function initPopularProducts() {
    const cards = $$(".popular-products .product-order-btn");
    if (!cards.length) return;
    const cart = loadCart();

    function toggle(btn) {
        const id = btn.dataset.id;
        if (!id) return;
        if (cart.has(id)) {
            cart.delete(id);
            btn.classList.remove("in-cart");
            btn.textContent = "Заказать";
        } else {
            cart.add(id);
            btn.classList.add("in-cart");
            btn.textContent = "В корзине";
        }
        saveCart(cart);
    }

    cards.forEach(btn => {
        const id = btn.dataset.id;
        if (id && cart.has(id)) {
            btn.classList.add("in-cart");
            btn.textContent = "В корзине";
        }
        btn.addEventListener("click", () => toggle(btn));
    });
    
    // Добавляем кнопки избранного на главной странице
    setTimeout(() => {
        addFavoriteButtons();
    }, 100);
}

// Gift certificate page
function initCertificatePage() {
    const amountDisplay = $(".gift-amount");
    const amountButtons = $$(".amount-btn");
    const customAmount = $(".custom-amount");
    const progressFill = $("#progressFill");
    const form = $("#giftForm");
    const modalBackdrop = $(".modal-backdrop");
    const closeModal = () => modalBackdrop?.classList.remove("open");
    const buyMoreBtn = $("#modalBuyMore");
    const exitBtn = $("#modalExit");

    if (!form) return;

    let selectedAmount = 3000;

    function updateAmount(amount) {
        selectedAmount = amount;
        if (amountDisplay) amountDisplay.textContent = `${amount.toLocaleString("ru-RU")} ₽`;
    }

    amountButtons.forEach(btn => {
        btn.addEventListener("click", e => {
            amountButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            updateAmount(Number(btn.dataset.amount));
            progressFill.style.width = "40%";
            customAmount.value = "";
        });
    });

    customAmount?.addEventListener("input", () => {
        const value = Number(customAmount.value);
        if (value > 0) {
            amountButtons.forEach(b => b.classList.remove("selected"));
            updateAmount(value);
            progressFill.style.width = "50%";
        }
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        progressFill.style.width = "100%";
        modalBackdrop?.classList.add("open");
    });

    buyMoreBtn?.addEventListener("click", () => {
        form.reset();
        progressFill.style.width = "0%";
        amountButtons.forEach(b => b.classList.remove("selected"));
        updateAmount(3000);
        closeModal();
    });

    exitBtn?.addEventListener("click", () => {
        closeModal();
        window.location.href = "index.html";
    });
}

// Floating button scroll
function initFloatingButton() {
    const button = $(".floating-btn");
    if (!button) return;
    const targetId = button.dataset.target || "gift";
    button.addEventListener("click", () => {
        const section = document.getElementById(targetId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

// Mobile menu
function initMobileMenu() {
    const menuBtn = $(".mobile-menu-btn");
    const nav = $(".nav-menu");
    if (!menuBtn || !nav) return;
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}

// Добавляем CSS для кнопок избранного
function addFavoriteStyles() {
    if (!document.getElementById('favorite-styles')) {
        const style = document.createElement('style');
        style.id = 'favorite-styles';
        style.textContent = `
            .favorite-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                color: #ccc;
                transition: var(--transition);
                z-index: 2;
            }
            
            .favorite-btn:hover {
                background: white;
                color: #ff6b6b;
            }
            
            .favorite-btn.active {
                color: #ff6b6b;
                animation: heartBeat 0.5s;
            }
            
            @keyframes heartBeat {
                0% { transform: scale(1); }
                25% { transform: scale(1.2); }
                50% { transform: scale(1); }
                75% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Логика для кнопки "Заказать" в избранном
function initFavoritesPage() {
    const removeButtons = $$('.remove-favorite');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            removeFromFavorites(productId);
        });
    });
    
    function removeFromFavorites(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Перезагружаем страницу
        window.location.reload();
    }
}

// Добавляем кнопки избранного на все страницы
function addFavoriteButtonsToAllPages() {
    // Добавляем кнопки на главной странице
    if (document.body.dataset.page === 'index') {
        setTimeout(() => {
            addFavoriteButtons();
        }, 500);
    }
    
    // Добавляем кнопки на странице каталога
    if (document.body.dataset.page === 'catalog') {
        // Кнопки уже добавляются в initCatalogPage
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initHeroSlider();
    initCatalogPage();
    initPopularProducts();
    initCertificatePage();
    initFloatingButton();
    initMobileMenu();
    updateNavigationAuth();
    addFavoriteStyles();
    
    // Инициализируем страницу избранного
    if (document.body.dataset.page === 'favorites') {
        initFavoritesPage();
    }
    
    // Добавляем кнопки избранного на все страницы
    addFavoriteButtonsToAllPages();
    
    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = $('.nav-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        });
    });
});

// Глобальные функции для использования в HTML
window.toggleFavorite = toggleFavorite;
window.logout = logout;