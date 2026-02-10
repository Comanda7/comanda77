// JavaScript для каталога товаров

document.addEventListener('DOMContentLoaded', function() {
    // Массив товаров (100 товаров)
const products = [
    {id: 1, category: "premium", name: "Ободок", price: 1000, image: "images/product1.png"},
    {id: 2, category: "modern", name: "Сережки клубнички", price: 1500, image: "images/product2.png"},
    {id: 3, category: "classic", name: "Ремень с пряжкой", price: 2000, image: "images/product3.png"},
    {id: 4, category: "modern", name: "Сережки месяц", price: 2500, image: "images/product4.png"},
    {id: 5, category: "modern", name: "Заколки крылья ангела", price: 800, image: "images/product5.png"},
    {id: 6, category: "classic", name: "Шарфик с лошадкой", price: 1200, image: "images/product6.png"},
    {id: 7, category: "modern", name: "Заколка веточка", price: 1800, image: "images/product7.png"},
    {id: 8, category: "classic", name: "Перчатки с ноготочками", price: 2200, image: "images/product8.png"},
    {id: 9, category: "premium", name: "Ободок ушки оленя", price: 3000, image: "images/product9.png"},
    {id: 10, category: "classic", name: "Варежки", price: 900, image: "images/product10.png"},
    {id: 11, category: "premium", name: "Заколка крыло", price: 1100, image: "images/product11.png"},
    {id: 12, category: "classic", name: "Французская кепка", price: 1700, image: "images/product12.png"},
    {id: 13, category: "classic", name: "Цепочка бабочка", price: 2400, image: "images/product13.png"},
    {id: 14, category: "classic", name: "Кружевная юбка", price: 2800, image: "images/product14.png"},
    {id: 15, category: "classic", name: "Звездочка подшиватель", price: 700, image: "images/product15.png"},
    {id: 16, category: "classic", name: "Теплые носочки", price: 600, image: "images/product16.png"},
    {id: 17, category: "premium", name: "Крабик королевы", price: 950, image: "images/product17.png"},
    {id: 18, category: "modern", name: "Сережки клетка", price: 3200, image: "images/product18.png"},
    {id: 19, category: "modern", name: "Сережки солнышко", price: 1900, image: "images/product19.png"},
    {id: 20, category: "classic", name: "Музыкальная брошь", price: 1300, image: "images/product20.png"},
    {id: 21, category: "classic", name: "Брошь ласточки", price: 1400, image: "images/product21.png"},
    {id: 22, category: "premium", name: "Косынка кружевная", price: 2700, image: "images/product22.png"},
    {id: 23, category: "classic", name: "Брошь веер", price: 3500, image: "images/product23.png"},
    {id: 24, category: "classic", name: "Цепочка сердечки", price: 1600, image: "images/product24.png"},
    {id: 25, category: "premium", name: "Крабик бантик", price: 2100, image: "images/product25.png"},
    {id: 26, category: "modern", name: "Китайские сережки", price: 3800, image: "images/product26.png"},
    {id: 27, category: "classic", name: "Осенний шарфик", price: 2900, image: "images/product27.png"},
    {id: 28, category: "classic", name: "Английский ремень", price: 850, image: "images/product28.png"},
    {id: 29, category: "classic", name: "Брошь перо", price: 550, image: "images/product29.png"},
    {id: 30, category: "classic", name: "Шарфик в клеточку", price: 1200, image: "images/product30.png"},
    {id: 31, category: "classic", name: "Новогодние носочки", price: 950, image: "images/product31.png"},
    {id: 32, category: "classic", name: "Нюд шарф", price: 750, image: "images/product32.png"},
    {id: 33, category: "premium", name: "Новогодний ободок", price: 2600, image: "images/product33.png"},
    {id: 34, category: "classic", name: "Носочки олени", price: 1800, image: "images/product34.png"},
    {id: 35, category: "premium", name: "Неведимка заколка", price: 2200, image: "images/product35.png"},
    {id: 36, category: "modern", name: "Сережки треугольнички", price: 3100, image: "images/product36.png"},
    {id: 37, category: "premium", name: "Скрепка сердечко", price: 1450, image: "images/product37.png"},
    {id: 38, category: "classic", name: "Дружные носочки", price: 3300, image: "images/product38.png"},
    {id: 39, category: "classic", name: "Скреплялка ромашка", price: 2700, image: "images/product39.png"},
    {id: 40, category: "modern", name: "Сережки бантики", price: 1950, image: "images/product40.png"},
    {id: 41, category: "classic", name: "Ремень кожанный", price: 1250, image: "images/product41.png"},
    {id: 42, category: "classic", name: "Шарфик проста", price: 4200, image: "images/product42.png"},
    {id: 43, category: "premium", name: "Ободок повязка", price: 1150, image: "images/product43.png"},
    {id: 44, category: "premium", name: "Бантикикс", price: 1650, image: "images/product44.png"},
    {id: 45, category: "premium", name: "Ободок роза", price: 1350, image: "images/product45.png"},
    {id: 46, category: "premium", name: "Невидимки листочки", price: 1850, image: "images/product46.png"},
    {id: 47, category: "premium", name: "Ободок с надписью", price: 5500, image: "images/product47.png"},
    {id: 48, category: "exclusive", name: "Пружинка", price: 2300, image: "images/product48.png"},
    {id: 49, category: "premium", name: "Просто повязка", price: 1950, image: "images/product49.png"},
    {id: 50, category: "premium", name: "Расческа вырвиволосы", price: 4500, image: "images/product50.png"},
    {id: 51, category: "premium", name: "Прозрачные резинки", price: 2800, image: "images/product51.png"},
    {id: 52, category: "exclusive", name: "Красная сумочка", price: 1650, image: "images/product52.png"},
    {id: 53, category: "premium", name: "Набор для волос", price: 3200, image: "images/product53.png"},
    {id: 54, category: "premium", name: "Невидимка черни", price: 4800, image: "images/product54.png"},
    {id: 55, category: "premium", name: "Невидимка", price: 2250, image: "images/product55.png"},
    {id: 56, category: "premium", name: "Заколка звездочка", price: 950, image: "images/product56.png"},
    {id: 57, category: "premium", name: "Просто бантик", price: 1850, image: "images/product57.png"},
    {id: 58, category: "premium", name: "Пикми расческа", price: 1950, image: "images/product58.png"},
    {id: 59, category: "exclusive", name: "Недоножницы", price: 1250, image: "images/product59.png"}
]
    // Инициализация localStorage для избранного и корзины
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Элементы DOM
    const productsContainer = document.getElementById('products-container');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const minPriceValue = document.getElementById('min-price-value');
    const maxPriceValue = document.getElementById('max-price-value');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    // Параметры фильтрации
    let currentCategory = 'all';
    let currentSort = 'default';
    let minPrice = 0;
    let maxPrice = 10000;
    let currentPage = 1;
    const productsPerPage = 12;

    // Инициализация
    function init() {
        if (priceMin && priceMax) {
            priceMin.value = minPrice;
            priceMax.value = maxPrice;
            minPriceValue.textContent = minPrice + ' ₽';
            maxPriceValue.textContent = maxPrice + ' ₽';
            
            priceMin.addEventListener('input', function() {
                minPrice = parseInt(this.value);
                minPriceValue.textContent = minPrice + ' ₽';
            });
            
            priceMax.addEventListener('input', function() {
                maxPrice = parseInt(this.value);
                maxPriceValue.textContent = maxPrice + ' ₽';
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentCategory = this.value;
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', function() {
                currentSort = this.value;
            });
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', goToPrevPage);
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', goToNextPage);
        }

        displayProducts();
    }

    // Применение фильтров
    function applyFilters() {
        currentPage = 1;
        displayProducts();
    }

    // Сброс фильтров
    function resetFilters() {
        if (categoryFilter) categoryFilter.value = 'all';
        if (sortBy) sortBy.value = 'default';
        if (priceMin && priceMax) {
            priceMin.value = 0;
            priceMax.value = 10000;
            minPrice = 0;
            maxPrice = 10000;
            minPriceValue.textContent = '0 ₽';
            maxPriceValue.textContent = '10000 ₽';
        }
        
        currentCategory = 'all';
        currentSort = 'default';
        currentPage = 1;
        
        displayProducts();
    }

    // Фильтрация и сортировка товаров
    function getFilteredAndSortedProducts() {
        let filteredProducts = products.filter(product => {
            if (currentCategory !== 'all' && product.category !== currentCategory) {
                return false;
            }
            
            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }
            
            return true;
        });

        switch (currentSort) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return filteredProducts;
    }

    // Отображение товаров
    function displayProducts() {
        if (!productsContainer) return;
        
        const filteredProducts = getFilteredAndSortedProducts();
        
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        if (pageInfo) {
            pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
        }
        
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages;
        }
        
        productsContainer.innerHTML = '';
        
        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        
        if (productsToShow.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">Товары не найдены. Попробуйте изменить параметры фильтрации.</p>';
        }
    }

    // Создание карточки товара
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card-catalog';
        
        // Проверяем наличие в избранном и корзине
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const isFavorite = favorites.some(fav => fav.id === product.id);
        const isInCart = cart.some(item => item.id === product.id);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/product1.png'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} ₽</p>
                <div class="product-actions">
                    <button class="add-to-favorites ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                        ${isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
                    </button>
                    <button class="add-to-cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                        ${isInCart ? '✓ В корзине' : '🛒 В корзину'}
                    </button>
                </div>
            </div>
        `;
        
        const favoriteBtn = card.querySelector('.add-to-favorites');
        const cartBtn = card.querySelector('.add-to-cart');
        
        favoriteBtn.addEventListener('click', function() {
            toggleFavorite(product, this);
        });
        
        cartBtn.addEventListener('click', function() {
            toggleCart(product, this);
        });
        
        return card;
    }

    // Добавление/удаление из избранного
    function toggleFavorite(product, button) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        const existingIndex = favorites.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            favorites.splice(existingIndex, 1);
            button.textContent = '🤍 В избранное';
            button.classList.remove('active');
        } else {
            favorites.push(product);
            button.textContent = '❤️ В избранном';
            button.classList.add('active');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Добавление/удаление из корзины
    function toggleCart(product, button) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            cart.splice(existingIndex, 1);
            button.textContent = '🛒 В корзину';
            button.classList.remove('active');
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
            button.textContent = '✓ В корзине';
            button.classList.add('active');
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Пагинация
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    }

    function goToNextPage() {
        const filteredProducts = getFilteredAndSortedProducts();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
        }
    }

    init();
});