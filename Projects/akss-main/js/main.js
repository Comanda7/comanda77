// Основной JavaScript файл

// Бургер меню
document.addEventListener('DOMContentLoaded', function() {
    // Бургер меню
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            burgerMenu.classList.toggle('active');
            
            // Анимация бургер-меню
            const spans = burgerMenu.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
                
                const spans = burgerMenu.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Кликабельный текст в футере
    const clickableText = document.querySelector('.clickable-text');
    if (clickableText) {
        clickableText.addEventListener('click', function() {
            alert('Спасибо за интерес! Мы скоро добавим больше информации.');
        });
    }
    
    // Инициализация корзины и избранного из localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
});