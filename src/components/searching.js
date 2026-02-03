import { rules, createComparison } from "../lib/compare.js";

/**
 * Инициализирует функцию поиска по указанным полям
 * @param {string} searchField - имя поля формы, содержащего поисковый запрос
 * @returns {function} Функция (data, state, action) → filteredData
 */

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
   const compare = createComparison(
        ['skipEmptyTargetValues'],  // имена стандартных правил (строки!)
        [                           // Пользовательское правило: вызов searchMultipleFields с нужными параметрами
            rules.searchMultipleFields(
                searchField,                        // поле формы с запросом
                ['date', 'customer', 'seller'],     // поля для поиска в данных
                false                               // без учёта регистра
            )
        ]
    );
    return (data, state, action) => {
        
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    };
}