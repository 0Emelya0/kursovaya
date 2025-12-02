import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTDnE9LPdO2W5GSr6KrKIMkPYcun4Z3SE",
    authDomain: "kursovaya-30ea8.firebaseapp.com",
    projectId: "kursovaya-30ea8",
    storageBucket: "kursovaya-30ea8.firebasestorage.app",
    messagingSenderId: "1079038592956",
    appId: "1:1079038592956:web:d05b5a7a63d52487b88db9",
    measurementId: "G-6RFFEKXTP1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let shoesDatabase = [];

async function loadShoesFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, "shoes"));
        shoesDatabase = [];
        querySnapshot.forEach((doc) => {
            shoesDatabase.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log('Данные загружены из Firebase:', shoesDatabase.length, 'моделей');
        displayShoes(shoesDatabase);
        populateFilters();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        loadLocalShoes();
    }
}

function loadLocalShoes() {
    shoesDatabase = [
        {
            id: "local-1",
            name: "Кроссовки Nike Air Max 270",
            size: 42,
            color: "черный",
            material: "текстиль",
            country: "США",
            badge: "Хит",
            image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Cpath fill='%23333' d='M50,80 L150,80 L140,150 L60,150 Z'/%3E%3Ccircle fill='%23000' cx='70' cy='170' r='10'/%3E%3Ccircle fill='%23000' cx='130' cy='170' r='10'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='100' y='110' text-anchor='middle'%3ENike Air Max%3C/text%3E%3C/svg%3E"
        },
        {
            id: "local-2",
            name: "Туфли кожаные классические",
            size: 41,
            color: "коричневый",
            material: "кожа",
            country: "Италия",
            badge: "Премиум",
            image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Cpath fill='%238B4513' d='M60,90 L140,90 L130,160 L70,160 Z'/%3E%3Cpath fill='%23592c0c' d='M80,90 L120,90 L115,140 L85,140 Z'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='100' y='120' text-anchor='middle'%3EКлассические%3C/text%3E%3C/svg%3E"
        }
    ];
    displayShoes(shoesDatabase);
    populateFilters();
}

async function addShoeToFirebase(shoeData) {
    try {
        const docRef = await addDoc(collection(db, "shoes"), shoeData);
        console.log('Обувь добавлена с ID:', docRef.id);
        showMessage('Обувь успешно добавлена!', 'success');
        return true;
    } catch (error) {
        console.error('Ошибка добавления обуви:', error);
        showMessage('Ошибка при добавлении обуви: ' + error.message, 'error');
        return false;
    }
}

function showMessage(message, type) {
    const messageEl = document.getElementById('formMessage');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

function getUniqueValues(key) {
    const values = shoesDatabase.map(shoe => shoe[key]);
    return [...new Set(values)].sort((a, b) => a - b);
}

function populateFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        return;
    }

    [sizeSelect, colorSelect, materialSelect, countrySelect].forEach(select => {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
    });

    const sizes = getUniqueValues('size');
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    const colors = getUniqueValues('color');
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        colorSelect.appendChild(option);
    });

    const materials = getUniqueValues('material');
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material.charAt(0).toUpperCase() + material.slice(1);
        materialSelect.appendChild(option);
    });

    const countries = getUniqueValues('country');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

function displayShoes(shoes) {
    const shoesGrid = document.getElementById('shoesGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!shoesGrid || !resultsCount) {
        return;
    }
    
    shoesGrid.innerHTML = '';
    resultsCount.textContent = shoes.length;

    if (shoes.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    } else {
        noResultsMessage.style.display = 'none';
    }

    shoes.forEach(shoe => {
        const shoeCard = document.createElement('div');
        shoeCard.className = 'shoe-card';
        
        const badge = shoe.badge ? `<div class="shoe-badge">${shoe.badge}</div>` : '';
        
        shoeCard.innerHTML = `
            ${badge}
            <div class="shoe-image-container">
                <img src="${shoe.image}" alt="${shoe.name}" class="shoe-image" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect fill=\'%23f5f5f5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%23999\' font-family=\'Arial\' font-size=\'14\' x=\'100\' y=\'100\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3E${encodeURIComponent(shoe.name)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="shoe-info">
                <h3 class="shoe-name">${shoe.name}</h3>
                <div class="shoe-details">
                    <span class="shoe-detail">Размер: ${shoe.size}</span>
                    <span class="shoe-detail">${shoe.color}</span>
                    <span class="shoe-detail">${shoe.material}</span>
                    <span class="shoe-detail">${shoe.country}</span>
                </div>
            </div>
        `;
        
        shoesGrid.appendChild(shoeCard);
    });
}

function applyFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        return;
    }
    
    const selectedSize = sizeSelect.value;
    const selectedColor = colorSelect.value;
    const selectedMaterial = materialSelect.value;
    const selectedCountry = countrySelect.value;

    const filteredShoes = shoesDatabase.filter(shoe => {
        return (!selectedSize || shoe.size == selectedSize) &&
               (!selectedColor || shoe.color === selectedColor) &&
               (!selectedMaterial || shoe.material === selectedMaterial) &&
               (!selectedCountry || shoe.country === selectedCountry);
    });

    displayShoes(filteredShoes);
    if (window.innerWidth <= 768) {
        switchPage('catalog');
    }
}

function resetFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        return;
    }
    
    sizeSelect.value = '';
    colorSelect.value = '';
    materialSelect.value = '';
    countrySelect.value = '';
    
    displayShoes(shoesDatabase);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const shoeData = {
        name: formData.get('name'),
        size: parseInt(formData.get('size')),
        color: formData.get('color'),
        material: formData.get('material'),
        country: formData.get('country'),
        badge: formData.get('badge') || '',
        image: formData.get('image')
    };

    if (!shoeData.name || !shoeData.size || !shoeData.color || !shoeData.material || !shoeData.country || !shoeData.image) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    addShoeToFirebase(shoeData).then(success => {
        if (success) {
            event.target.reset();
            loadShoesFromFirebase();
            if (window.innerWidth <= 768) {
                switchPage('catalog');
            }
        }
    });
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const activePage = document.getElementById(pageId + 'Page');
    if (activePage) {
        activePage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item, .mobile-nav-item, .mobile-bottom-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

document.addEventListener('DOMContentLoaded', () => {
    loadShoesFromFirebase();
    
    const navItems = document.querySelectorAll('[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            switchPage(pageId);
        });
    });
    
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
    document.getElementById('resetFiltersMessage')?.addEventListener('click', resetFilters);
    
    document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
        switchPage('filters');
    });
    
    document.getElementById('addShoeForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelForm')?.addEventListener('click', () => {
        document.getElementById('addShoeForm').reset();
        showMessage('Форма очищена', 'success');
    });
    
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('active');
    });
    
    document.getElementById('mobileMenuClose')?.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    onSnapshot(collection(db, "shoes"), () => {
        loadShoesFromFirebase();
    });
    
    function checkMobileNavigation() {
        const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
        const desktopNav = document.querySelector('.desktop-nav');
        
        if (isMobileDevice()) {
            mobileBottomNav.style.display = 'flex';
            desktopNav.style.display = 'none';
            switchPage('catalog');
        } else {
            mobileBottomNav.style.display = 'none';
            desktopNav.style.display = 'flex';
        }
    }
    
    checkMobileNavigation();
    window.addEventListener('resize', checkMobileNavigation);
});
