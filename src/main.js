import './fonts/ys-display/fonts.css'
import './style.css'

import { sampleTable, data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initPagination } from "./components/pagination.js";    // @todo: подключение (Шаг 2)
import { initSorting } from './components/sorting.js';          // Шаг 3 
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);
// @todo: инициализация Шаг 5
const applySearching = initSearching(sampleTable.search.elements);  // переметр - имя поля search ?????

// @todo: инициализация Шаг 4
const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
    searchBySeller: indexes.sellers                             // для элемента с именем searchBySeller устанавливаем массив продавцов
}); 

// @todo: инициализация                                         // Шаг 3
const applySorting = initSorting([                              // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]); 
// @todo: инициализация
const applyPagination = initPagination(                         // Шаг 2
    sampleTable.pagination.elements,                            // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                                  // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
); 

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container)); // Шаг2
    const rowsPerPage = parseInt(state.rowsPerPage);            // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);                     // номер страницы по умолчанию 1 и тоже число

    return {
        ...state,
        rowsPerPage,
        page
    }; 
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
export function render(action) {
    let state = collectState();                                 // состояние полей из таблицы
    let result = [...data];                                     // копируем для последующего изменения
    
  
    result = applyFiltering(result, state, action);            // @todo: использование Шаг 4
    result = applySorting(result, state, action);               // @todo: использование Шаг 3
    result = applyPagination(result, state, action);            // @todo: использование Шаг 2

    sampleTable.render(result);
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
