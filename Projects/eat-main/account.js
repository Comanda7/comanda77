console.log('Account.js: Инициализация личного кабинета...');

document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('account.html')) {
        console.log('Account.js: Не на странице личного кабинета, выходим');
        return;
    }
    
    console.log('Account.js: Начинаем инициализацию личного кабинета');
    
    if (typeof window.loadCart !== 'function') {
        console.error('Account.js: ОШИБКА! Глобальные функции не загружены. Убедитесь, что main.js загружен ПЕРВЫМ!');
        alert('Ошибка загрузки функций. Пожалуйста, обновите страницу.');
        return;
    }
    
    document.querySelectorAll('.account-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            console.log('Account.js: Нажата кнопка меню:', target);
            
            document.querySelectorAll('.account-menu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            this.classList.add('active');
            
            document.querySelectorAll('.account-section').forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                if (target === 'cart') {
                    console.log('Account.js: Загрузка корзины...');
                    window.loadCart();
                } else if (target === 'favorites') {
                    console.log('Account.js: Загрузка избранного...');
                    window.loadFavorites();
                } else if (target === 'addresses') {
                    console.log('Account.js: Загрузка адресов...');
                    window.loadAddresses();
                }
            }
            
            window.location.hash = target;
        });
    });
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Account.js: Сохранение профиля');
            alert('Изменения профиля сохранены успешно!');
        });
    }
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Вы уверены, что хотите выйти?')) {
                console.log('Account.js: Выход из аккаунта');
                alert('Вы успешно вышли из аккаунта');
                window.location.href = 'index.html';
            }
        });
    }
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Account.js: Изменен фильтр заказов');
            });
        });
    }
    console.log('Account.js: Загрузка начальных данных...');
    window.loadCart();
    window.loadFavorites();
    const hash = window.location.hash.substring(1);
    if (hash) {
        console.log('Account.js: Загрузка по hash:', hash);
        const targetItem = document.querySelector(`.account-menu-item[href="#${hash}"]`);
        if (targetItem) {
            targetItem.click();
        }
    }
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.classList.toggle('active');
                console.log('Account.js: Мобильное меню:', nav.classList.contains('active') ? 'открыто' : 'закрыто');
            }
        });
    }
    
    console.log('Account.js: Инициализация личного кабинета завершена успешно!');
});