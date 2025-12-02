// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTDnE9LPdO2W5GSr6KrKIMkPYcun4Z3SE",
    authDomain: "kursovaya-30ea8.firebaseapp.com",
    projectId: "kursovaya-30ea8",
    storageBucket: "kursovaya-30ea8.firebasestorage.app",
    messagingSenderId: "1079038592956",
    appId: "1:1079038592956:web:d05b5a7a63d52487b88db9",
    measurementId: "G-6RFFEKXTP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// База данных обуви (теперь будем использовать Firebase)
let shoesDatabase = [];

// Функция для загрузки данных из Firebase
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
        // Если Firebase не доступен, используем локальные данные
        loadLocalShoes();
    }
}

// Локальные данные для fallback
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

// Функция для добавления новой обуви в Firebase
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

// Функция для показа сообщений
function showMessage(message, type) {
    const messageEl = document.getElementById('formMessage');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Функция для получения уникальных значений из базы данных
function getUniqueValues(key) {
    const values = shoesDatabase.map(shoe => shoe[key]);
    return [...new Set(values)].sort((a, b) => a - b);
}

// Функция для заполнения выпадающих списков
function populateFilters() {
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const countrySelect = document.getElementById('country');
    
    if (!sizeSelect || !colorSelect || !materialSelect || !countrySelect) {
        console.error('Один или несколько элементов select не найдены в DOM');
        return;
    }

    // Очищаем существующие опции (кроме первой)
    [sizeSelect, colorSelect, materialSelect, countrySelect].forEach(select => {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
    });

    // Размеры
    const sizes = getUniqueValues('size');
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    // Цвета
    const colors = getUniqueValues('color');
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        colorSelect.appendChild(option);
    });

    // Материалы
    const materials = getUniqueValues('material');
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material.charAt(0).toUpperCase() + material.slice(1);
        materialSelect.appendChild(option);
    });

    // Страны
    const countries = getUniqueValues('country');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Функция для отображения обуви
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
        document.getElementById('resetFiltersFromEmpty').addEventListener('click', resetFilters);
        return;
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

// Функция для применения фильтров
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

// Функция для сброса фильтров
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

// Функция для обработки формы добавления обуви
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

    // Валидация
    if (!shoeData.name || !shoeData.size || !shoeData.color || !shoeData.material || !shoeData.country || !shoeData.image) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    // Добавляем в Firebase
    addShoeToFirebase(shoeData).then(success => {
        if (success) {
            event.target.reset();
            // Обновляем данные из Firebase
            loadShoesFromFirebase();
        }
    });
}

// Функция для переключения видимости формы
function toggleFormVisibility() {
    const formSection = document.getElementById('addShoeSection');
    const toggleBtn = document.getElementById('toggleFormBtn');
    
    if (formSection.style.display === 'none') {
        formSection.style.display = 'block';
        toggleBtn.textContent = 'Скрыть форму добавления';
    } else {
        formSection.style.display = 'none';
        toggleBtn.textContent = 'Добавить новую обувь';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем существование основных элементов
    const mainElements = [
        'size', 'color', 'material', 'country', 
        'shoesGrid', 'resultsCount', 'applyFilters', 'resetFilters',
        'addShoeForm', 'cancelForm', 'toggleFormBtn', 'addShoeSection'
    ];
    
    let allElementsExist = true;
    mainElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Элемент с id "${elementId}" не найден в DOM`);
            allElementsExist = false;
        }
    });
    
    if (!allElementsExist) {
        console.error('Не все необходимые элементы найдены в DOM');
        return;
    }
    
    // Загружаем данные из Firebase
    loadShoesFromFirebase();
    
    // Настраиваем обработчики событий
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('addShoeForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelForm').addEventListener('click', () => {
        document.getElementById('addShoeForm').reset();
        showMessage('Форма очищена', 'success');
    });
    document.getElementById('toggleFormBtn').addEventListener('click', toggleFormVisibility);

    // Real-time updates from Firebase
    onSnapshot(collection(db, "shoes"), (snapshot) => {
        console.log('Real-time update received');
        loadShoesFromFirebase();
    });
});
