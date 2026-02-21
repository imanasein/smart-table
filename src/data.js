
const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {

    let sellers;                                            // переменные для кеширования данных
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (data) => data.map(item => ({        // функция для приведения строк в тот вид, который нужен нашей таблице
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // функция получения индексов от сервера 
    async function getIndexes() {
        if (!sellers || !customers) {                       // если индексы ещё не установлены, то делаем запросы
            try {
                [sellers, customers] = await Promise.all([  // запрашиваем и деструктурируем в уже объявленные ранее переменные
                    fetch(`${BASE_URL}/sellers`).then(res => {
                        if (!res.ok) {                      // проверим на корректность ответ сервера
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                        return res.json();                  // запрашиваем продавцов
                    }),
                    fetch(`${BASE_URL}/customers`).then(res => {
                        if (!res.ok) {                      // проверим на корректность ответ сервера
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                        return res.json();                  // запрашиваем покупателей
                    })
                ]);
            } catch (error) {
                console.error('Error fetching indexes:', error);
                throw error;                                // Перебрасываем ошибку дальше
            }
        }
        return { sellers, customers };                      // возвращаем массив продовцов и покупателей 
    }

    // функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        if (typeof query !== 'object') {                    // проверка аргумента query, что является объектом
            throw new Error('Query is not an object');
        }
        const qs = new URLSearchParams(query);              // преобразуем объект параметров в SearchParams объект, представляющий query часть url
        const nextQuery = qs.toString();                    // и приводим к строковому виду

        if (lastQuery === nextQuery && !isUpdated) {        // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult;                              // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый квери не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        try {
            const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
            if (!response.ok) {                             // проверяем ответ на корректность 
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const records = await response.json();

            lastQuery = nextQuery;                              // сохраняем для следующих запросов
            lastResult = {
                total: records.total,
                items: mapRecords(records.items)
            };

            return lastResult;

        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    };

    return {
        getIndexes,
        getRecords
    };
}