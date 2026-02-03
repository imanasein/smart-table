import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
   /* const compare = createComparison([
        rules.skipEmptyTargetValues,        // Правило из стандартных правил
        rules.searchMultipleFields(
            searchField,                    // Имя поля поиска из аргумента функции
            ['date', 'customer', 'seller'], // Поля для поиска
            false                           // Без учёта регистра
        )
    ]);*/

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
       // return data.filter(row => compare(row, state));
    };
}