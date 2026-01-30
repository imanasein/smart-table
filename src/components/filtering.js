import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                         // Перебираем по именам
            elements[elementName].append(                   // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])      // формируем массив имён, значений опций
                    .map(name => {                          // используйте name как значение и текстовое содержимое
                        const option = document.createElement('option');   // @todo: создать и вернуть тег опции
                        option.value = name;                // Значение опции
                        option.textContent = name;          // Текстовое содержимое опции
                        return option;
                        })
            )
        }) 

/* Добавьте очистку полей фильтров. Это опциональный шаг,                                           !!!!!
поэтому не будем его расписывать детально. На текущий момент вы уже должны справиться с ним сами,   !!!!!
но если не получается, к нему можно вернуться позже.                                                !!!!!
*/

    return (data, state, action) => {
        
        // @todo: #4.2 — обработать очистку поля
        if (action && action.target && action.target.name === 'clear') {
            const clearButton = action.target;
            const parentElement = clearButton.parentElement;            // находим родительский элемент label где находятся и кнопка, и input.
            const inputElement = parentElement.querySelector('input');  // находим input внутри родителя
            if (inputElement) {
                inputElement.value = '';                                // Сброс значения поля ввода
                const fieldName = clearButton.getAttribute('data-field');   // Получаем имя поля из атрибута data-field кнопки
                if (fieldName) {
                    state[fieldName] = '';                              // Обновляем соответствующее поле в state
                }
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}