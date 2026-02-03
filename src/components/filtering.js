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
            );
        })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        //console.log('Filter action:', action); // Отладка
        if (action && action.name === 'clear') {   // если кнопка clear
            const clearButton = action;              // сохраняем кнопку которая сработала
            const parentEl = clearButton.closest('.filter-wrapper');    // находим радительский элемент кнопки
            const currentInput = parentEl.querySelector('input');   // в родителе находим <input>
            if (currentInput) {
                currentInput.value = "";                    // очищаем поле <input>
            }                
            const fieldName = clearButton.getAttribute('data-field'); // находим значение атрибута data-field кнопки
            if (fieldName in state) {
                state[fieldName] = "";                      // и очищаем соответствующее поле в state
            }                    
        }
        
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}