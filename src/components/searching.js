import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = (row, searchValue) => {
        if (!searchValue || searchValue.trim() === '') {    // Если строка поиска пуста — показываем все данные
            return true;
        }
        // Приводим поисковую строку к нижнему регистру для регистронезависимого поиска
        const searchStr = searchValue.toLowerCase().trim();

        return Object.values(row).some(value => {           // Проходим по всем полям строки данных
            const fieldStr = String(value).toLowerCase();   // Приводим значение поля к строке и к нижнему регистру
            return fieldStr.includes(searchStr);            // Проверяем, содержит ли поле поисковую строку
        });
    };

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField] || '';       // Получаем значение поиска из состояния
        const searchedData = data.filter(row => compare(row, searchValue));  // Применяем поиск ДО фильтрации
        
        return data;
    }
}