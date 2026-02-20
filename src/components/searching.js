/**
 * Инициализирует функцию поиска по указанным полям
 * @param {string} searchField - имя поля формы, содержащего поисковый запрос
 * @returns {function} Функция (query, state, action) → filteredData
 */

export function initSearching(searchField) {
    return (query, state, action) => {                          // result заменили на query
        return state[searchField] ? Object.assign({}, query, {  // проверяем, что в поле поиска было что-то введено
            search: state[searchField]                          // устанавливаем в query параметр
        }) : query;                                             // если поле с поиском пустое, просто возвращаем query без изменений
    }
}