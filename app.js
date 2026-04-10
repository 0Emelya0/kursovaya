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
const db = getFirestore(app); // ✅ Добавлена инициализация db

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
    if (!messageEl) return;
    
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

    // Очищаем все select, оставляя первый option "Все..."
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
        
        // Исправлен обработчик onerror
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
 `        `;
        
;
        
        shoes        shoesGrid.appendChildGrid.appendChild(shoe(shoeCard);
Card);
    });
    });
}

function}

function applyFilters applyFilters() {
() {
    const    const sizeSelect sizeSelect = document.getElementById(' = document.getElementById('size');
size');
    const colorSelect    const colorSelect = document = document.getElementById('.getElementById('color');
color');
       const const materialSelect materialSelect = document = document.getElementById('.getElementById('material');
material');
    const    const countrySelect countrySelect = document.getElementById(' = documentcountry');
.getElementById('    
   country');
 if (!    
    if (!sizeSelectsizeSelect || ! || !colorSelectcolorSelect || ! ||materialSelect !materialSelect || ! ||country !countrySelectSelect) {
) {
        console        console.error('.error('ОдинОдин или несколько или несколько элементов select элементов select не найд не найдены вены в DOM');
 DOM');
        return        return;
   ;
    }
    
 }
    
    const    const selectedSize selectedSize = size = sizeSelect.valueSelect.value;
   ;
    const selected const selectedColor =Color = colorSelect colorSelect.value;
.value;
    const    const selectedMaterial selectedMaterial = material = materialSelect.valueSelect.value;
   ;
    const selected const selectedCountry =Country = countrySelect countrySelect.value;

.value;

    const    const filteredS filteredShoeshoes = shoes = shoesDatabase.filterDatabase.filter(shoe(shoe => {
 => {
        return        return (!selectedSize || shoe.size == selectedSize) &&
               (!selectedColor || shoe.color === selectedColor) &&
               (!selectedMaterial || shoe.m (!selectedSize || shoe.size == selectedSize) &&
               (!selectedColor || shoe.color === selectedColor) &&
               (!selectedMaterial || shoe.materialaterial === === selectedMaterial selectedMaterial) &&
) &&
                             (!selectedCountry (!selectedCountry || shoe || shoe.country.country === selected ===Country);
 selectedCountry);
       });

 });

    display    displayShoShoes(filteres(filteredSedShoeshoes);
}

);
}

function resetfunction resetFilters()Filters() {
    {
    const sizeSelect = document.getElementById const sizeSelect = document.getElementById('size('size');
   ');
    const color const colorSelect =Select = document.getElementById document.getElementById('('colorcolor');
    const materialSelect = document.getElementById');
    const materialSelect = document.getElementById('material('material');
   ');
    const country const countrySelect = document.getElementByIdSelect = document.getElementById('country('country');
    
');
    
    if    if (!size (!sizeSelect ||Select !color ||Select || !colorSelect || !material !materialSelect || !countrySelectSelect || !countrySelect)) {
        {
        console.error('О console.error('Один илидин или несколько элементов несколько элементов select select не не найдены найдены в DOM в DOM');
       ');
        return;
 return;
    }
    }
    
       
    sizeSelect sizeSelect.value =.value = '';
    '';
    colorSelect colorSelect.value =.value = '';
    '';
    materialSelect materialSelect.value =.value = '';
    '';
    countrySelect countrySelect.value =.value = '';
 '';
    
    
    display    displayShoShoes(shes(shoesDatabaseoesDatabase);
}

);
}

function handlefunction handleFormSubmitFormSubmit(event)(event) {
    {
    event.preventDefault event.preventDefault();
();
    
    
    const    const formData formData = new = new FormData FormData(event.target(event.target);
   );
    const shoe const shoeData =Data = {
        {
        name: name: formData formData.get('.get('name'),
name'),
        size        size: parseInt(formData: parseInt(formData.get('.get('size')),
size')),
        color        color: form: formData.getData.get('color('color'),
       '),
        material: material: formData formData.get('.get('material'),
        countrymaterial'),
        country: form: formDataData.get.get('country('country'),
       '),
        badge: badge: formData formData.get('.get('badgebad') ||ge '',
       ') || image '',
       : image: formData formData.get('.get('image')
image')
    };

    };

    if    if (!shoeData.name (!shoe || !Data.nameshoeData || !shoeData.size ||.size || !shoe !shoeData.colorData.color || ! || !shoeDatashoeData.material.material || ! || !shoeDatashoeData.country.country || ! || !shoeDatashoeData.image).image) {
        {
        showMessage('П showMessage('Пожалуйста, заполнитеожалуйста, заполните все обяза все обязательные полятельные поля', '', 'error');
error');
        return        return;
   ;
    }

    }

    add addSShoehoeToToFirebaseFirebase(shoe(shoeData).Data).then(sthen(success =>uccess => {
        {
        if ( if (success)success) {
            {
            event.target event.target.reset();
.reset();
            load            loadShoShoesFromesFromFirebaseFirebase();
       ();
        }
    }
    });
}

 });
}

function togglefunction toggleFormVisibilityFormVisibility() {
() {
    const    const formSection formSection = document = document.getElementById('.getElementById('addSaddShoeSectionhoeSection');
   ');
    const toggle const toggleBtnBtn = document.getElementById = document.getElementById('toggle('FormBtntoggleFormBtn');
    
');
    if    
    if (!form (!formSection ||Section || !toggle !toggleBtn)Btn) return;
 return;
    
       
    if ( if (formSectionformSection.style.display === '.style.displaynone === '') {
       none') {
        formSection formSection.style.display = '.style.display = 'blockblock';
        toggle';
        toggleBtn.textBtn.textContent =Content = 'С 'Скрытькрыть форму добав форму добавления';
ления';
    }    } else else {
 {
               formSection.style form.display =Section.style.display = 'none';
        'none';
        toggleBtn toggleBtn.textContent.textContent = ' = 'ДобаДобавить новвить новую обую обувувь';
ь';
    }
    }
}

//}

// Инициализация Ини при зациализациягрузке при загрузке DOM
 DOM
document.addEventListenerdocument.addEventListener('DOM('DOMContentLoadedContentLoaded', ()', () => => {
 {
    const    const mainElements mainElements = [
 = [
               ' 'size',size', ' 'colorcolor',', ' 'material',material', 'country 'country', 
', 
        '        'shoesshoesGrid',Grid', 'results 'resultsCountCount',', 'apply 'applyFilters',Filters', 'reset 'resetFilters',
Filters',
        '        'addSaddShoehoeFormForm', '', 'cancelFormcancelForm', '', 'toggleFormtoggleFormBtn',Btn', 'add 'addShoeSection'
ShoeSection'
    ];
    ];
    
       
    let all let allElementsExistElementsExist = true = true;
   ;
    mainElements mainElements.forEach(element.forEach(elementIdId => => {
        {
        const element const element = document.getElementById(element = documentId);
.getElementById(element        ifId);
 (!element        if (!element) {
) {
            console            console.error(`.error(`ЭлемЭлемент сент с id "${ id "${elementIdelementId}" не}" не найден найден в DOM в DOM`);
           `);
            allElements allElementsExist =Exist = false;
 false;
        }
        }
    });
    });
    
       
    if (! if (!allElementsallElementsExist)Exist) {
        {
        console.error console.error('Не('Не все необходим все необходимые элементыые элементы найдены найдены в DOM в DOM');
       ');
        return;
 return;
    }
    }
    
       
    load loadShoesFromFirebase();
ShoesFromFirebase();
    
    document.getElementById('applyFilters    
    document.getElementById('applyFilters').add').addEventListener('EventListener('click',click', applyFilters applyFilters);
   );
    document.getElementById document.getElementById('reset('resetFilters').Filters').addEventListeneraddEventListener('('clickclick', reset', resetFilters);
Filters);
       document document.getElementById('.getElementById('addSaddShoeFormhoeForm').add').addEventListener('EventListener('submit',submit', handleForm handleFormSubmit);
Submit);
    document    document.getElementById('.getElementById('cancelFormcancelForm').add').addEventListener('EventListener('click',click', () => () => {
        {
        document.getElementById document.getElementById('addShoe('addShoeForm').Form').reset();
reset();
        show        showMessage('Message('ФормаФорма очищ очищена',ена', ' 'successsuccess');
   ');
    });
    });
    document.getElementById document.getElementById('('toggletoggleFormBtnFormBtn').add').addEventListener('EventListener('click',click', toggleFormVisibility);

 toggleFormVisibility);

    //    // На Настройка realстройка real-time об-time обновленийновлений
   
    onSnapshot onSnapshot(collection(collection(db(db, "sh, "shoes"),oes"), (sn (snapshot)apshot) => {
 => {
        console        console.log('.log('Real-timeReal-time update received');
        update received');
        loadS loadShoeshoesFromFireFromFirebase();
    });
});
