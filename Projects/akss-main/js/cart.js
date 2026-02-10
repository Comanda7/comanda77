// JavaScript для корзины и заказа

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров из корзины на странице доставки
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalCostElement = document.getElementById('total-cost');
    
    if (orderItemsContainer) {
        loadCartItems();
    }
    
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p>Корзина пуста</p>';
            if (subtotalElement) subtotalElement.textContent = '0 ₽';
            if (totalCostElement) totalCostElement.textContent = '500 ₽'; // Только доставка
            return;
        }
        
        let subtotal = 0;
        orderItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} ₽</span>
            `;
            orderItemsContainer.appendChild(itemElement);
            
            subtotal += item.price * item.quantity;
        });
        
        const deliveryCost = 500;
        const total = subtotal + deliveryCost;
        
        if (subtotalElement) subtotalElement.textContent = subtotal + ' ₽';
        if (totalCostElement) totalCostElement.textContent = total + ' ₽';
    }
    
    // Обновление корзины при изменениях
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            loadCartItems();
        }
    });
});