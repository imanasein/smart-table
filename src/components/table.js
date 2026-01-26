import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    const root = cloneTemplate(tableTemplate);
    
    if (Array.isArray(before)) {                                        // Проверяем является ли переданный аргумент массивом (true)
        before.reverse().forEach(subName => {                           // перебираем нужный массив идентификаторов
            root[subName] = cloneTemplate(subName);                     // клонируем и получаем объект, сохраняем в таблице
            root.container.prepend(root[subName].container);            // добавляем к таблице после (append) или до (prepend)
        });
    }
    
    if (Array.isArray(after)) {                                          // Обрабатываем шаблоны "после" (after) тоже самое
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.append(root[subName].container);
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', (e) => {                   // к root.container добавить обработчики событий change
        onAction();                                                      // вызов onAction без аргумента
    });

    root.container.addEventListener('reset', (e) => {                   // к root.container добавить обработчики событий reset
        setTimeout(() => {
            onAction();                                                 // Отложенный вызов onAction
        }, 0);                                                          // Минимальная задержка для обеспечения очистки полей
    });

    root.container.addEventListener('submit', (e) => {                  // к root.container добавить обработчики событий submit
         e.preventDefault();                                            // предотвращаем стандартное поведение формы
         onAction(e.submitter);                                         // передаем submitter в onAction
    });

    const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {                         // Трансформируем данные в строки 
            const row = cloneTemplate(rowTemplate);                 // получаем клонированный шаблон строки
            Object.keys(item).forEach(key => {                      // перебор по ключам данных
                if (row.elements[key]) {                            // проверяем, что key существует в row.elements
                    row.elements[key].textContent = item[key];      // если да, то в его textContent присваиваем данные item[key]
                } 
            });
            return row;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}