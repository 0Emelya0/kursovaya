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

// Инициализация Firebase
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
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Cpath fill='%23333' d='M50,80 L150,80 L140,150 L60,150 Z'/%3E%3Ccircle fill='%23000' cx='70' cy='170' r='10'/%3E%3Ccircle fill='%23000' cx='130' cy='170' r='10'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='100' y='110' text-anchor='middle'%3ENike Air Max%3C/text%3E%3C/svg%3E"
        },
        {
            id: "local-2",
            name: "Туфли кожаные классические",
            size: 41,
            color: "коричневый",
            material: "кожа",
            country: "Италия",
            badge: "Премиум",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Cpath fill='%238B4513' d='M60,90 L140,90 L130,160 L70,160 Z'/%3E%3Cpath fill='%23592c0c' d='M80,90 L120,90 L115,140 L85,140 Z'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='100' y='120' text-anchor='middle'%3EКлассические%3C/text%3E%3C/svg%3E"
        }
    ];
    displayShoes(shoesDatabase);
    populateFilters();
}

async function addShoeToFirebase(shoeData) {
    try {
        console.log('Попытка добавления обуви:', shoeData);
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
    if (!messageEl) {
        console.error('Элемент formMessage не найден');
        return;
    }
    
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

function getUniqueValues(key) {
    const values = shoesDatabase.map(shoe => shoe[key]).filter(val => val != null);
    if (key === 'size') {
        return [...new Set(values)].sort((a, b) => a - b);
    }
    return [...new Set(values)].sort();
}

function populateFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        console.error('Один или несколько элементов select не найдены в DOM');
        return;
    }

    [sizeSelect, colorSelect, materialSelect, countrySelect].forEach(select => {
        const defaultOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (defaultOption) {
            select.appendChild(defaultOption.cloneNode(true));
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = select.id === 'size' ? 'Все размеры' : 
                                select.id === 'color' ? 'Все цвета' :
                                select.id === 'material' ? 'Все материалы' : 'Все страны';
            select.appendChild(option);
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
    
    if (!shoesGrid || !resultsCount) {
        console.error('Элементы shoesGrid или resultsCount не найдены в DOM');
        return;
    }
    
    shoesGrid.innerHTML = '';
    resultsCount.textContent = shoes.length;

    if (shoes.length === 0) {
        shoesGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">📦</div>
                <h3 class="no-results-title">Ничего не найдено</h3>
                <p class="no-results-text">Попробуйте изменить параметры фильтрации</p>
                <button id="resetFiltersFromEmpty" class="btn btn-primary">
                    Сбросить фильтры
                </button>
            </div>
        `;
        const resetBtn = document.getElementById('resetFiltersFromEmpty');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
        return;
    }

    shoes.forEach(shoe => {
        const shoeCard = document.createElement('div');
        shoeCard.className = 'shoe-card';
        
        const badge = shoe.badge ? `<div class="shoe-badge">${shoe.badge}</div>` : '';
        
        const fallbackImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f5f5' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='100' y='100' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(shoe.name.substring(0, 20))}%3C/text%3E%3C/svg%3E`;
        
        shoeCard.innerHTML = `
            ${badge}
            <div class="shoe-image-container">
                <img src="${shoe.image}" alt="${shoe.name}" class="shoe-image" onerror="this.src='${fallbackImage}'">
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
        console.error('Один или несколько элементов select не найдены в DOM');
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
}

function resetFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        console.error('Один или несколько элементов select не найдены в DOM');
        return;
    }
    
    sizeSelect.value = '';
    colorSelect.value = '';
    materialSelect.value = '';
    countrySelect.value = '';
    
    displayShoes(shoesDatabase);
}

// ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ ОБРАБОТКИ ФОРМЫ
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Форма отправлена');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Получаем значения из формы по правильным ID
    const shoeData = {
        name: document.getElementById('shoeName')?.value || '',
        size: parseInt(document.getElementById('shoeSize')?.value) || 0,
        color: document.getElementById('shoeColor')?.value || '',
        material: document.getElementById('shoeMaterial')?.value || '',
        country: document.getElementById('shoeCountry')?.value || '',
        badge: document.getElementById('shoeBadge')?.value || '',
        image: document.getElementById('shoeImage')?.value || ''
    };
    
    console.log('Данные формы:', shoeData);

    // Проверяем заполнение всех полей
    if (!shoeData.name || !shoeData.size || !shoeData.color || 
        !shoeData.material || !shoeData.country || !shoeData.image) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        console.log('Не все поля заполнены');
        return;
    }
    
    // Проверяем размер
    if (shoeData.size < 35 || shoeData.size > 50) {
        showMessage('Размер должен быть от 35 до 50', 'error');
        return;
    }
    
    // Проверяем URL изображения
    try {
        new URL(shoeData.image);
    } catch (e) {
        showMessage('Введите корректный URL изображения', 'error');
        return;
    }

    // Добавляем обувь
    addShoeToFirebase(shoeData).then(success => {
        if (success) {
            form.reset();
            // Скрываем форму после успешного добавления
            const formSection = document.getElementById('addShoeSection');
            const toggleBtn = document.getElementById('toggleFormBtn');
            if (formSection && toggleBtn) {
                formSection.style.display = 'none';
                toggleBtn.textContent = 'Добавить новую обувь';
            }
            // Перезагружаем список
            loadShoesFromFirebase();
        }
    });
}

function toggleFormVisibility() {
    const formSection = document.getElementById('addShoeSection');
    const toggleBtn = document.getElementById('toggleFormBtn');
    
    if (!formSection || !toggleBtn) {
        console.error('Элементы формы не найдены');
        return;
    }
    
    if (formSection.style.display === 'none' || formSection.style.display === '') {
        formSection.style.display = 'block';
        toggleBtn.textContent = 'Скрыть форму добавления';
    } else {
        formSection.style.display = 'none';
        toggleBtn.textContent = 'Добавить новую обувь';
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация...');
    
    // Проверяем наличие всех элементов
    const elements = {
        size: document.getElementById('size'),
        color: document.getElementById('color'),
        material: document.getElementById('material'),
        country: document.getElementById('country'),
        shoesGrid: document.getElementById('shoesGrid'),
        resultsCount: document.getElementById('resultsCount'),
        applyFilters: document.getElementById('applyFilters'),
        resetFilters: document.getElementById('resetFilters'),
        addShoeForm: document.getElementById('addShoeForm'),
        cancelForm: document.getElementById('cancelForm'),
        toggleFormBtn: document.getElementById('toggleFormBtn'),
        addShoeSection: document.getElementById('addShoeSection')
    };
    
    let allExist = true;
    for (let [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Элемент ${name} не найден`);
            allExist = false;
        }
    }
    
    if (!allExist) {
        console.error('Не все элементы найдены, остановка инициализации');
        return;
    }
    
    console.log('Все элементы найдены, настройка слушателей...');
    
    // Загружаем данные
    loadShoesFromFirebase();
    
    // Настраиваем слушатели событий
    elements.applyFilters.addEventListener('click', applyFilters);
    elements.resetFilters.addEventListener('click', resetFilters);
    
    // ✅ ВАЖНО: Используем правильный обработчик для формы
    elements.addShoeForm.addEventListener('submit', handleFormSubmit);
    
    elements.cancelForm.addEventListener('click', () => {
        elements.addShoeForm.reset();
        showMessage('Форма очищена', 'success');
    });
    
    elements.toggleFormBtn.addEventListener('click', toggleFormVisibility);

    // Настройка real-time обновлений
    try {
        onSnapshot(collection(db, "shoes"), (snapshot) => {
            console.log('Real-time update received');
            loadShoesFromFirebase();
        });
    } catch (error) {
        console.error('Ошибка настройки real-time обновлений:', error);
    }
    
    console.log('Инициализация завершена');
});

// ✅ ДОБАВЛЯЕМ ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ДЛЯ ОТЛАДКИ
window.addEventListener('load', () => {
    console.log('Страница полностью загружена');
    
    // Проверяем форму
    const form = document.getElementById('addShoeForm');
    if (form) {
        console.log('Форма найдена, текущий обработчик:', form.onsubmit);
    } else {
        console.error('Форма не найдена при загрузке страницы');
    }
});
