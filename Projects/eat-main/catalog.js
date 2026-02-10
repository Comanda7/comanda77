console.log('Catalog.js: Инициализация каталога...');

let currentPage = 1;
let itemsPerPage = 12; 
let currentProducts = []; 
let allProductCards = []; 

function initCatalog() {
    console.log('Инициализация каталога...');
   
    allProductCards = Array.from(document.querySelectorAll('.product-card'));
    console.log('Всего карточек в DOM:', allProductCards.length);
    

    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetBtn = document.getElementById('reset-filters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    initPagination();
    
    applyFilters();
    
    console.log('Каталог инициализирован успешно!');
}

function applyFilters() {
    console.log('Применение фильтров...');
    
    currentPage = 1;
    
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;
    
    let filtered = allProductCards;
    
    if (category !== 'all') {
        filtered = filtered.filter(card => card.dataset.category === category);
    }
    
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(card => {
            const price = parseInt(card.dataset.price);
            return price >= min && price <= max;
        });
    }
    
    currentProducts = filtered;
    
    if (sort !== 'default') {
        sortProducts(sort);
    }
    
    console.log(`После фильтрации: ${filtered.length} товаров`);
    
    updateDisplay();
    
    updatePageInfo();
}

function sortProducts(sortType) {
    console.log('Сортировка по:', sortType);
    
    currentProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        const nameA = a.querySelector('.product-title').textContent.toLowerCase();
        const nameB = b.querySelector('.product-title').textContent.toLowerCase();
        
        switch(sortType) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            default:
                return 0;
        }
    });
}

function updateDisplay() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = currentProducts.slice(startIndex, endIndex);
    
    productsToShow.forEach(card => {
        const cardClone = card.cloneNode(true);
        container.appendChild(cardClone);
    });
    
    console.log(`Отображено ${productsToShow.length} товаров (страница ${currentPage})`);
    
    updatePaginationButtons();
}

function updatePageInfo() {
    const pageInfo = document.getElementById('page-info');
    if (!pageInfo) return;
    
    const totalPages = Math.max(1, Math.ceil(currentProducts.length / itemsPerPage));
    pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
}

function updatePaginationButtons() {
    const totalPages = Math.max(1, Math.ceil(currentProducts.length / itemsPerPage));
    
    const firstBtn = document.getElementById('first-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const lastBtn = document.getElementById('last-page');
    
    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;
}

function initPagination() {
    console.log('Инициализация пагинации...');
    
    const firstBtn = document.getElementById('first-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const lastBtn = document.getElementById('last-page');
    
    if (firstBtn) {
        firstBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage = 1;
                updateDisplay();
                updatePageInfo();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateDisplay();
                updatePageInfo();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(currentProducts.length / itemsPerPage));
            if (currentPage < totalPages) {
                currentPage++;
                updateDisplay();
                updatePageInfo();
            }
        });
    }
    
    if (lastBtn) {
        lastBtn.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(currentProducts.length / itemsPerPage));
            if (currentPage < totalPages) {
                currentPage = totalPages;
                updateDisplay();
                updatePageInfo();
            }
        });
    }
}
function resetFilters() {
    console.log('Сброс фильтров...');
    
    document.getElementById('category-filter').value = 'all';
    document.getElementById('price-filter').value = 'all';
    document.getElementById('sort-filter').value = 'default';
    
    currentPage = 1;
    currentProducts = allProductCards;
    
    updateDisplay();
    updatePageInfo();
}
window.getProductByDataId = function(dataId) {
    console.log('Поиск товара по data-id:', dataId);
    
    const allCards = Array.from(document.querySelectorAll('.product-card'));
    const card = allCards.find(card => {
        const addToCartBtn = card.querySelector(`.add-to-cart[data-id="${dataId}"]`);
        return addToCartBtn !== null;
    });
    
    if (card) {
        const product = {
            id: parseInt(dataId),
            name: card.querySelector('.product-title')?.textContent || 'Товар',
            price: parseInt(card.dataset.price) || 0,
            category: card.dataset.category || 'grocery',
            brand: card.querySelector('.product-brand')?.textContent || '',
            weight: card.querySelector('.product-details')?.textContent || '',
            image: card.querySelector('.product-image img')?.src || `img/${dataId}.png`,
            description: `Вкусный и свежий продукт. ${card.querySelector('.product-details')?.textContent || ''}`
        };
        
        console.log('Товар найден в DOM:', product);
        return product;
    }
    
    console.warn('Товар не найден в DOM, поиск в глобальном массиве...');
    if (window.products) {
        const product = window.products.find(p => p.id == dataId);
        if (product) {
            console.log('Товар найден в глобальном массиве:', product);
            return product;
        }
    }
    
    console.error('Товар не найден ни в DOM, ни в массиве');
    return null;
};
window.openProductModal = function(productDataId) {
    console.log('Открытие модального окна для товара с data-id:', productDataId);
    
    const product = window.getProductByDataId(productDataId);
    if (!product) {
        console.error('openProductModal: Товар не найден');
        return;
    }
    const existingModal = document.querySelector('.product-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
        document.body.style.overflow = '';
    }
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-body">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='img/1.png'; this.className='product-image-fallback'">
                </div>
                <div class="modal-product-info">
                    <span class="modal-product-category">${window.getCategoryName(product.category)}</span>
                    <div class="modal-product-brand">${product.brand}</div>
                    <h2 class="modal-product-title">${product.name}</h2>
                    <div class="modal-product-weight">${product.weight}</div>
                    <div class="modal-product-description">${product.description || 'Описание товара отсутствует.'}</div>
                    <div class="modal-product-rating">
                        <span class="rating-stars">★★★★☆</span>
                        <span class="rating-count">4.5 (42)</span>
                    </div>
                    <div class="modal-product-price-section">
                        <div class="modal-product-price">${product.price} руб.</div>
                        <div class="modal-product-actions">
                            <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> В корзину
                            </button>
                            <button class="fav-btn-modal" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favBtn = modal.querySelector('.fav-btn-modal');
    if (favorites.some(fav => fav.id == product.id)) {
        favBtn.classList.add('active');
        favBtn.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c"></i>';
    }
    
    function closeModal() {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
            console.log('Модальное окно закрыто');
        }
    }
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.add-to-cart-modal').addEventListener('click', function() {
        window.addToCart(product.id);
        
        const btn = this;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        btn.style.backgroundColor = '#2ecc71';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1000);
    });
    modal.querySelector('.fav-btn-modal').addEventListener('click', function() {
        window.toggleFavorite(product.id, this);
        
        const cardFavBtn = document.querySelector(`.fav-btn[data-id="${product.id}"]`);
        if (cardFavBtn) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.some(fav => fav.id == product.id)) {
                cardFavBtn.classList.add('active');
                cardFavBtn.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c"></i>';
            } else {
                cardFavBtn.classList.remove('active');
                cardFavBtn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        }
    });
    
    function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    }
    
    document.addEventListener('keydown', escHandler);
    
    console.log('Модальное окно открыто для товара:', product.name);
};


document.addEventListener('DOMContentLoaded', function() {
    console.log('Catalog.js: DOM загружен, инициализируем каталог...');

    initCatalog();
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-details')) {
            const btn = e.target.closest('.btn-details');
            const dataId = btn.getAttribute('data-id');
            console.log('Клик по кнопке "Подробнее", data-id:', dataId);
            e.preventDefault();
            e.stopPropagation();
            window.openProductModal(dataId);
        }
    });
    
    console.log('Catalog.js: Инициализация завершена!');
});