import './fonts/ys-display/fonts.css'
import './style.css'

// работа базовой таблицы
import { sampleTable } from "./data/dataset_1.js";
// загрузка данных
import { initData } from "./data.js";
// плагины к таблице
import { processFormData } from "./lib/utils.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

const api = initData();                                         //Инициализируем данные с сервера с помощью API

// инициализация плагинов с функцией перерисовки и API
const applySearching = initSearching('search');
const applySorting = initSorting([                              // @todo: инициализация   
    sampleTable.header.elements.sortByDate,                     // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByTotal
]);
const { applyPagination, updatePagination } = initPagination(     // @todo: инициализация пагинации теперь две функции                      
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
    const state = processFormData(new FormData(sampleTable.container));
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
export async function render(action) {                          // делаем асинхронную функцию перерисовки таблицы
    let state = collectState();                                 // состояние полей из таблицы
    let query = {};                                             // пустой объект запроса на сервер 

    query = applySearching(query, state, action);               // обновляем query в соотв с данными поиска
    query = applyFiltering(query, state, action);               // обновляем query в соотв с данными фильтрации          
    query = applySorting(query, state, action);                 // обновляем query в соотв с данными сортировки
    query = applyPagination(query, state, action);              // обновляем query в соотв с данными пагинации

    const { total, items } = await api.getRecords(query);       // запрашиваем данные с собранными параметрами 

    updatePagination(total, query);                             // перерисовываем пагинатор
    sampleTable.render(items);                                  // items данные от сервера
}

const appRoot = document.querySelector('#app');                 // элемент интерфейса отрисовки таблицы 
appRoot.appendChild(sampleTable.container)

let applyFiltering;                                             // объявляем переменные для того чтобы передать в них 
let updateIndexes;                                              // index внутри функции иначе область видимости не соответствует

async function init() {
    try {
        const indexes = await api.getIndexes();                 // получаем индексы потом инициализируем фильтрацию

        ({ applyFiltering, updateIndexes } = initFiltering(
            sampleTable.filter.elements,                        // передаём элементы фильтра 
            {
                searchBySeller: indexes.sellers                 // для элемента с именем searchBySeller устанавливаем массив продавцов
            }
        ));

        updateIndexes(sampleTable.filter.elements, {            // Добавляем обновление индексов
            searchBySeller: indexes.sellers
        });
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
}

init().then(render)                                             // Первый раз запрашиваем индексы и вызываем отрисовку таблицы