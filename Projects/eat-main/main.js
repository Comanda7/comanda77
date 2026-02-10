console.log('Main.js: Инициализация...');
window.addToCart = function(productId) {
    console.log('addToCart: Добавление товара', productId);
    let product = window.products?.find(p => p.id == productId);
    
    if (!product) {
        const productCard = document.querySelector(`.product-card .add-to-cart[data-id="${productId}"]`)?.closest('.product-card');
        
        if (productCard) {
            product = {
                id: parseInt(productId),
                name: productCard.querySelector('.product-title')?.textContent || 'Товар',
                price: parseInt(productCard.getAttribute('data-price')) || 0,
                category: productCard.getAttribute('data-category') || 'grocery',
                brand: productCard.querySelector('.product-brand')?.textContent || '',
                weight: productCard.querySelector('.product-details')?.textContent || '',
                image: productCard.querySelector('.product-image img')?.getAttribute('src') || `img/${productId}.png`,
                description: `Вкусный и свежий продукт. ${productCard.querySelector('.product-details')?.textContent || ''}`
            };
        }
    }
    
    if (!product) {
        console.error(`Товар с id ${productId} не найден`);
        return false;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('addToCart: Текущая корзина', cart);
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('addToCart: Увеличение количества существующего товара');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            brand: product.brand,
            weight: product.weight,
            category: product.category,
            description: product.description
        });
        console.log('addToCart: Добавлен новый товар');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('addToCart: Корзина сохранена', cart);
    window.updateCartCounters();
    
    if (document.getElementById('cart-items')) {
        window.loadCart();
    }
    
    const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Добавлено!';
        btn.style.backgroundColor = '#2ecc71';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1000);
    }
    
    return true;
};

window.removeFromCart = function(productId) {
    console.log('removeFromCart: Удаление товара', productId);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('removeFromCart: До удаления', cart.length, 'товаров');
    
    cart = cart.filter(item => item.id != productId);
    
    console.log('removeFromCart: После удаления', cart.length, 'товаров');
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (document.getElementById('cart-items')) {
        window.loadCart();
    }
    
    window.updateCartCounters();
    
    return true;
};

window.updateCartQuantity = function(productId, change) {
    console.log('updateCartQuantity: Изменение количества', productId, change);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            console.log('updateCartQuantity: Товар удален, так как количество стало 0');
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (document.getElementById('cart-items')) {
            window.loadCart();
        }
        
        window.updateCartCounters();
    }
};
window.loadCart = function() {
    console.log('loadCart: Загрузка корзины в интерфейс');
    
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) {
        console.log('loadCart: Контейнер корзины не найден');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartEmpty = document.getElementById('cart-empty');
    
    console.log('loadCart: Товаров в корзине', cart.length);
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        if (cartEmpty) {
            cartEmpty.classList.add('active');
            cartContainer.appendChild(cartEmpty);
            console.log('loadCart: Показываем сообщение "Корзина пуста"');
        }
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const deliveryEl = document.getElementById('cart-delivery');
        const totalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (subtotalEl) subtotalEl.textContent = '0 руб.';
        if (deliveryEl) deliveryEl.textContent = '0 руб.';
        if (totalEl) totalEl.textContent = '0 руб.';
        if (checkoutBtn) checkoutBtn.disabled = true;
        
        return;
    }
    
    if (cartEmpty) {
        cartEmpty.classList.remove('active');
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const product = window.products?.find(p => p.id == item.id);
        const imagePath = item.image || product?.image || `img/${item.id}.png`;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="${imagePath}" alt="${item.name}" onerror="this.onerror=null; this.src='img/1.png'; this.className='product-image-fallback'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity} = ${itemTotal} руб.</div>
                <div class="cart-item-weight">${item.weight} • ${item.brand}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}" title="Уменьшить">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}" title="Увеличить">+</button>
                </div>
                <button class="btn btn-danger remove-btn" data-id="${item.id}">Удалить</button>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });
    
    const delivery = subtotal >= 2000 ? 0 : 300;
    const total = subtotal + delivery;
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryEl = document.getElementById('cart-delivery');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (subtotalEl) subtotalEl.textContent = subtotal + ' руб.';
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Бесплатно' : delivery + ' руб.';
    if (totalEl) totalEl.textContent = total + ' руб.';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    console.log('loadCart: Корзина загружена, итого:', total + ' руб.');
};

window.updateCartCounters = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    console.log('updateCartCounters: Обновление счетчиков корзины, товаров:', count);
    
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
    
    const cartBadges = document.querySelectorAll('.icon-link2 .badge, a[href*="cart"] .badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
    });
    
    const cartCountMenu = document.getElementById('cart-count-menu');
    if (cartCountMenu) {
        cartCountMenu.textContent = count;
    }
};


window.toggleFavorite = function(productId, button) {
    console.log('toggleFavorite: Переключение избранного для товара', productId);
    
    let product = window.products?.find(p => p.id == productId);
    
    if (!product) {
        const productCard = document.querySelector(`.product-card .add-to-cart[data-id="${productId}"]`)?.closest('.product-card');
        
        if (productCard) {
            product = {
                id: parseInt(productId),
                name: productCard.querySelector('.product-title')?.textContent || 'Товар',
                price: parseInt(productCard.getAttribute('data-price')) || 0,
                category: productCard.getAttribute('data-category') || 'grocery',
                brand: productCard.querySelector('.product-brand')?.textContent || '',
                weight: productCard.querySelector('.product-details')?.textContent || '',
                image: productCard.querySelector('.product-image img')?.getAttribute('src') || `img/${productId}.png`,
                description: `Вкусный и свежий продукт. ${productCard.querySelector('.product-details')?.textContent || ''}`
            };
        }
    }
    
    if (!product) {
        console.error(`Товар с id ${productId} не найден`);
        return false;
    }
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id == productId);
    
    if (index === -1) {
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            weight: product.weight,
            category: product.category,
            description: product.description
        });
        console.log('toggleFavorite: Товар добавлен в избранное');
        
        if (button) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c"></i>';
        }
    } else {
        favorites.splice(index, 1);
        console.log('toggleFavorite: Товар удален из избранного');
        
        if (button) {
            button.classList.remove('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.updateFavoritesCounters();
    
    if (document.getElementById('favorites-items')) {
        window.loadFavorites();
    }
    
    return true;
};
window.removeFromFavorites = function(productId) {
    console.log('removeFromFavorites: Удаление товара из избранного', productId);
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('removeFromFavorites: До удаления', favorites.length, 'товаров');
    
    favorites = favorites.filter(item => item.id != productId);
    
    console.log('removeFromFavorites: После удаления', favorites.length, 'товаров');
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    if (document.getElementById('favorites-items')) {
        window.loadFavorites();
    }
    
    window.updateFavoritesCounters();
    
    const favBtn = document.querySelector(`.fav-btn[data-id="${productId}"]`);
    if (favBtn) {
        favBtn.classList.remove('active');
        favBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
    
    return true;
};

window.loadFavorites = function() {
    console.log('loadFavorites: Загрузка избранного в интерфейс');
    
    const favContainer = document.getElementById('favorites-items');
    if (!favContainer) {
        console.log('loadFavorites: Контейнер избранного не найден');
        return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favEmpty = document.getElementById('favorites-empty');
    
    console.log('loadFavorites: Товаров в избранном', favorites.length);
    
    favContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        if (favEmpty) {
            favEmpty.classList.add('active');
            favContainer.appendChild(favEmpty);
        }
        return;
    }
    
    if (favEmpty) {
        favEmpty.classList.remove('active');
    }

    favorites.forEach(item => {
        const product = window.products?.find(p => p.id == item.id);
        const imagePath = item.image || product?.image || `img/${item.id}.png`;
        
        const favDiv = document.createElement('div');
        favDiv.className = 'favorite-item';
        favDiv.innerHTML = `
            <div class="favorite-item-image">
                <img src="${imagePath}" alt="${item.name}" onerror="this.onerror=null; this.src='img/1.png'; this.className='product-image-fallback'">
            </div>
            <div class="favorite-item-details">
                <div class="favorite-item-title">${item.name}</div>
                <div class="favorite-item-price">${item.price} руб.</div>
                <div class="favorite-item-category">${item.weight} • ${item.brand}</div>
            </div>
            <div class="favorite-item-actions">
                <button class="btn btn-primary add-from-fav" data-id="${item.id}">В корзину</button>
                <button class="btn btn-danger remove-fav-btn" data-id="${item.id}">Удалить</button>
            </div>
        `;
        favContainer.appendChild(favDiv);
    });
    
    console.log('loadFavorites: Избранное загружено');
};

window.updateFavoritesCounters = function() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const count = favorites.length;
    
    console.log('updateFavoritesCounters: Обновление счетчиков избранного, товаров:', count);
    
    document.querySelectorAll('#fav-count').forEach(el => {
        el.textContent = count;
    });
    
    const favBadges = document.querySelectorAll('.icon-link1 .badge, a[href*="favorites"] .badge');
    favBadges.forEach(badge => {
        badge.textContent = count;
    });
    
    const favoritesCount = document.getElementById('favorites-count');
    if (favoritesCount) {
        favoritesCount.textContent = count;
    }
};
window.getIconByCategory = function(category) {
    const icons = {
        'ready-food': 'utensils',
        'sweets': 'cookie-bite',
        'vegetables': 'carrot',
        'meat': 'drumstick-bite',
        'dairy': 'cheese',
        'bakery': 'bread-slice',
        'fish': 'fish',
        'beverages': 'coffee',
        'grocery': 'seedling',
        'frozen': 'snowflake',
        'baby': 'baby',
        'healthy': 'heartbeat'
    };
    return icons[category] || 'shopping-basket';
};
window.getCategoryName = function(category) {
    const categories = {
        'ready-food': 'Готовая еда',
        'sweets': 'Сладости и десерты',
        'vegetables': 'Овощи, фрукты, ягоды и зелень',
        'meat': 'Мясо, птица',
        'dairy': 'Молочные продукты, яйца',
        'bakery': 'Хлеб и выпечка',
        'fish': 'Рыба и морепродукты',
        'beverages': 'Напитки',
        'grocery': 'Бакалея',
        'frozen': 'Замороженные продукты',
        'baby': 'Детское питание',
        'healthy': 'Здоровое питание'
    };
    return categories[category] || 'Категория';
};

window.openProductModal = function(productId) {
    console.log('openProductModal: Открытие модального окна для товара', productId);
    
    let product = window.products?.find(p => p.id == productId);
    if (!product) {
        const productCard = document.querySelector(`.product-card .add-to-cart[data-id="${productId}"]`)?.closest('.product-card');
        
        if (productCard) {
            product = {
                id: parseInt(productId),
                name: productCard.querySelector('.product-title')?.textContent || 'Товар',
                price: parseInt(productCard.getAttribute('data-price')) || 0,
                category: productCard.getAttribute('data-category') || 'grocery',
                brand: productCard.querySelector('.product-brand')?.textContent || '',
                weight: productCard.querySelector('.product-details')?.textContent || '',
                image: productCard.querySelector('.product-image img')?.getAttribute('src') || `img/${productId}.png`,
                description: `Вкусный и свежий продукт. ${productCard.querySelector('.product-details')?.textContent || ''}`
            };
        } else {
            console.error('openProductModal: Товар не найден ни в массиве, ни в DOM');
            return;
        }
    }
    const existingModal = document.querySelector('.product-modal');
    if (existingModal) {
        console.log('openProductModal: Модальное окно уже открыто, закрываем');
        document.body.removeChild(existingModal);
        document.body.style.overflow = '';
    }
    const imagePath = product.image || `img/${product.id}.png`;
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-body">
                <div class="modal-product-image">
                    <img src="${imagePath}" alt="${product.name}" onerror="this.onerror=null; this.src='img/1.png'; this.className='product-image-fallback'">
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
    if (favorites.some(fav => fav.id == productId)) {
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
        window.addToCart(productId);
        
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
        window.toggleFavorite(productId, this);
        const cardFavBtn = document.querySelector(`.fav-btn[data-id="${productId}"]`);
        if (cardFavBtn) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.some(fav => fav.id == productId)) {
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
    
    console.log('openProductModal: Модальное окно открыто');
};
window.loadAddresses = function() {
    console.log('loadAddresses: Загрузка адресов');
    
    const addressesContainer = document.getElementById('addresses-list');
    const emptyState = document.getElementById('addresses-empty');
    
    if (!addressesContainer) {
        console.log('loadAddresses: Контейнер адресов не найден');
        return;
    }
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    console.log('loadAddresses: Найдено адресов:', addresses.length);

    addressesContainer.innerHTML = '';
    
    if (addresses.length === 0) {
        if (emptyState) {
            emptyState.classList.add('active');
            addressesContainer.appendChild(emptyState);
        }
        return;
    }
    if (emptyState) {
        emptyState.classList.remove('active');
    }
    const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
    });
    sortedAddresses.forEach(address => {
        const addressCard = createAddressCard(address);
        addressesContainer.appendChild(addressCard);
    });
    console.log('loadAddresses: Адреса загружены');
};
function createAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card' + (address.isDefault ? ' default' : '');
    card.dataset.id = address.id;
    
    card.innerHTML = `
        <div class="address-card-header">
            <div class="address-title">
                ${address.name}
                ${address.isDefault ? '<span class="address-default-badge">Основной</span>' : ''}
            </div>
            <div class="address-actions">
                <button class="address-edit-btn" data-id="${address.id}" title="Редактировать">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="address-delete-btn" data-id="${address.id}" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="address-details">
            <p><i class="fas fa-city"></i> ${address.city}</p>
            <p><i class="fas fa-road"></i> ${address.street}, д. ${address.house}</p>
            ${address.apartment ? `<p><i class="fas fa-door-closed"></i> Кв. ${address.apartment}</p>` : ''}
            ${address.entrance ? `<p><i class="fas fa-sign-in-alt"></i> Подъезд ${address.entrance}</p>` : ''}
            ${address.floor ? `<p><i class="fas fa-stairs"></i> Этаж ${address.floor}</p>` : ''}
            ${address.intercom ? `<p><i class="fas fa-bell"></i> Домофон: ${address.intercom}</p>` : ''}
            ${address.comment ? `<div class="address-comment"><i class="fas fa-comment"></i> ${address.comment}</div>` : ''}
        </div>
    `;
    
    return card;
}
function saveAddress(e) {
    e.preventDefault();
    
    const addressId = document.getElementById('address-id').value;
    const name = document.getElementById('address-name').value;
    const city = document.getElementById('address-city').value;
    const street = document.getElementById('address-street').value;
    const house = document.getElementById('address-house').value;
    const apartment = document.getElementById('address-apartment').value;
    const entrance = document.getElementById('address-entrance').value;
    const floor = document.getElementById('address-floor').value;
    const intercom = document.getElementById('address-intercom').value;
    const comment = document.getElementById('address-comment').value;
    const isDefault = document.getElementById('address-default').checked;
    if (!name || !city || !street || !house) {
        alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
        return;
    }

    let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    if (addressId) {
        const index = addresses.findIndex(a => a.id == addressId);
        if (index !== -1) {
            addresses[index] = {
                id: addressId,
                name, city, street, house, apartment, entrance, floor, intercom, comment, isDefault
            };
        }
    } else {
        const newId = Date.now().toString();
        addresses.push({
            id: newId,
            name, city, street, house, apartment, entrance, floor, intercom, comment, isDefault
        });
    }
    if (isDefault) {
        addresses.forEach(addr => {
            if (addr.id !== (addressId || newId)) {
                addr.isDefault = false;
            }
        });
    }
    
    localStorage.setItem('addresses', JSON.stringify(addresses));
    closeAddressModal();
    window.loadAddresses();
    
    alert('Адрес успешно сохранен!');
}

function deleteAddress(addressId) {
    if (!confirm('Вы уверены, что хотите удалить этот адрес?')) {
        return;
    }
    
    let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    addresses = addresses.filter(a => a.id != addressId);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    window.loadAddresses();
    
    alert('Адрес успешно удален!');
}
function openAddressModal(addressId = null) {
    console.log('openAddressModal: Открытие модального окна для адреса', addressId);
    
    const modal = document.getElementById('address-modal');
    const form = document.getElementById('address-form');
    const title = document.getElementById('modal-title');
    
    if (!modal || !form) {
        console.error('openAddressModal: Модальное окно или форма не найдены');
        return;
    }
    form.reset();
    
    if (addressId) {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const address = addresses.find(a => a.id == addressId);
        
        if (address) {
            title.textContent = 'Редактировать адрес';
            document.getElementById('address-id').value = address.id;
            document.getElementById('address-name').value = address.name || '';
            document.getElementById('address-city').value = address.city || '';
            document.getElementById('address-street').value = address.street || '';
            document.getElementById('address-house').value = address.house || '';
            document.getElementById('address-apartment').value = address.apartment || '';
            document.getElementById('address-entrance').value = address.entrance || '';
            document.getElementById('address-floor').value = address.floor || '';
            document.getElementById('address-intercom').value = address.intercom || '';
            document.getElementById('address-comment').value = address.comment || '';
            document.getElementById('address-default').checked = address.isDefault || false;
        }
    } else {
        title.textContent = 'Добавить новый адрес';
        document.getElementById('address-id').value = '';
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
function initAddresses() {
    console.log('initAddresses: Инициализация адресов');
    const addBtn = document.getElementById('add-address-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => openAddressModal());
    }
    
    const modal = document.getElementById('address-modal');
    if (modal) {
        modal.querySelector('.address-modal-overlay').addEventListener('click', closeAddressModal);
        
        modal.querySelector('.address-modal-close').addEventListener('click', closeAddressModal);
        
        const cancelBtn = modal.querySelector('.address-modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAddressModal);
        }
        
        const form = document.getElementById('address-form');
        if (form) {
            form.addEventListener('submit', saveAddress);
        }
    }
    window.loadAddresses();
    
    console.log('initAddresses: Инициализация завершена');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация функций...');
    window.updateCartCounters();
    window.updateFavoritesCounters();
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('Инициализация: Проверка избранного, товаров:', favorites.length);
    
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (favorites.some(fav => fav.id == id)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c"></i>';
        }
    });
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Добавление в корзину товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.addToCart(id);
        }
        if (e.target.closest('.fav-btn')) {
            const btn = e.target.closest('.fav-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Переключение избранного товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.toggleFavorite(id, btn);
        }
        if (e.target.closest('.btn-details')) {
            const btn = e.target.closest('.btn-details');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Открытие модального окна для товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.openProductModal(id);
        }
        if (e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Удаление из корзины товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.removeFromCart(id);
        }
        if (e.target.closest('.quantity-btn.minus')) {
            const btn = e.target.closest('.quantity-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Уменьшение количества товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.updateCartQuantity(id, -1);
        }
        
        if (e.target.closest('.quantity-btn.plus')) {
            const btn = e.target.closest('.quantity-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Увеличение количества товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.updateCartQuantity(id, 1);
        }
        if (e.target.closest('.remove-fav-btn')) {
            const btn = e.target.closest('.remove-fav-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Удаление из избранного товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.removeFromFavorites(id);
        }
        if (e.target.closest('.add-from-fav')) {
            const btn = e.target.closest('.add-from-fav');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Добавление в корзину из избранного товара', id);
            e.preventDefault();
            e.stopPropagation();
            window.addToCart(id);
            const originalText = btn.textContent;
            btn.textContent = 'Добавлено!';
            btn.style.backgroundColor = '#2ecc71';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 1000);
        }
        if (e.target.closest('.address-edit-btn')) {
            const btn = e.target.closest('.address-edit-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Редактирование адреса', id);
            e.preventDefault();
            e.stopPropagation();
            openAddressModal(id);
        }
        if (e.target.closest('.address-delete-btn')) {
            const btn = e.target.closest('.address-delete-btn');
            const id = btn.getAttribute('data-id');
            console.log('Клик: Удаление адреса', id);
            e.preventDefault();
            e.stopPropagation();
            deleteAddress(id);
        }
    });
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.classList.toggle('active');
                console.log('Мобильное меню:', nav.classList.contains('active') ? 'открыто' : 'закрыто');
            }
        });
    }
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if(this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if(target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            const total = document.getElementById('cart-total')?.textContent || '0 руб.';
            if (confirm(`Оформить заказ на сумму ${total}?`)) {
                alert('Заказ оформлен! Спасибо за покупку!');
                localStorage.removeItem('cart');
                window.loadCart();
                window.updateCartCounters();
            }
        });
    }
    if (window.location.pathname.includes('account.html')) {
        console.log('На странице account.html, загружаем корзину и избранное...');

        document.querySelectorAll('.account-menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                console.log('Нажата кнопка меню:', target);

                document.querySelectorAll('.account-menu-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.account-section').forEach(s => s.classList.remove('active'));
                const targetSection = document.getElementById(target);
                if (targetSection) {
                    targetSection.classList.add('active');

                    if (target === 'cart') {
                        console.log('Загрузка корзины...');
                        window.loadCart();
                    } else if (target === 'favorites') {
                        console.log('Загрузка избранного...');
                        window.loadFavorites();
                    } else if (target === 'addresses') {
                        console.log('Загрузка адресов...');
                        window.loadAddresses();
                    }
                }
            });
        });
        window.loadCart();
        window.loadFavorites();
    
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetItem = document.querySelector(`.account-menu-item[href="#${hash}"]`);
            if (targetItem) {
                targetItem.click();
            }
        }
    
        setTimeout(() => {
            if (typeof initAddresses === 'function') {
                initAddresses();
            }
        }, 100);
    }
    
    console.log('Инициализация завершена успешно!');
});
window.debugCart = function() {
    console.log('=== ДЕБАГ КОРЗИНЫ ===');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Товаров в корзине:', cart.length);
    console.log('Детали корзины:', cart);
    console.log('Общее количество:', cart.reduce((total, item) => total + item.quantity, 0));
    console.log('===================');
};

window.debugFavorites = function() {
    console.log('=== ДЕБАГ ИЗБРАННОГО ===');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('Товаров в избранном:', favorites.length);
    console.log('Детали избранного:', favorites);
    console.log('=======================');
};

window.clearAll = function() {
    if (confirm('Очистить ВСЕ данные (корзину, избранное и адреса)?')) {
        localStorage.removeItem('cart');
        localStorage.removeItem('favorites');
        localStorage.removeItem('addresses');
        window.updateCartCounters();
        window.updateFavoritesCounters();
        if (document.getElementById('cart-items')) window.loadCart();
        if (document.getElementById('favorites-items')) window.loadFavorites();
        if (document.getElementById('addresses-list')) window.loadAddresses();
        alert('Все данные очищены!');
    }
};

console.log('Main.js: Все функции загружены и готовы к работе!');