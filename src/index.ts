import './scss/styles.scss';
import { IEvents, EventEmitter } from './components/base/events';
import { ProductsModel } from './components/models/productsModel';
import { BuyerModel } from './components/models/buyerModel';
import { BasketModel } from './components/models/basketModel';
import { ICard, IProduct } from './types';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/larekApi/larekApi';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { CardProduct } from './components/view/CardProduct';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/view/Basket';
import { FormContacts } from './components/view/FormContacts';
import { FormOrder } from './components/view/FormOrder';
import { SuccessOrder } from './components/view/SuccessOrder';
import { CardGallery } from './components/view/CardGallery';

const events = new EventEmitter();
const api = new LarekAPI (CDN_URL, API_URL);

/*events.onAll((event) => {
    console.log(event.eventName, event.data)
})*/
// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Контейнеры
const headerContainer = document.querySelector('.header__container') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
if (!galleryContainer) {
    console.error('Контейнер галереи не найден в DOM');
    throw new Error('Контейнер галереи не найден');
}
const modalContainer = document.querySelector('.modal__container') as HTMLElement;
const basketContainer = document.querySelector('.basket') as HTMLElement;
const orderContainer = document.querySelector('.order') as HTMLFormElement;;
const contactsContainer = document.querySelector('.contacts__container') as HTMLFormElement;;
const successContainer = document.querySelector('.success__container') as HTMLElement;

// Экземпляры модели данных
const productsModel = new ProductsModel(events);
const buyerModel = new BuyerModel(events);
const basketModel = new BasketModel(events);

// Экземпляры классов представления
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer, events);

const modal = new Modal(modalContainer, events);

// Дополнительные представления
const basketView = new Basket(basketContainer, events);

const orderForm = new FormOrder(orderContainer, events);

const contactsForm = new FormContacts(contactsContainer, events);

const successView = new SuccessOrder(successContainer, {
	onClick: () => {
		modal.close();
	},
});

// Обработчик загрузки товаров

events.on('items:change', (items: IProduct[]) => {
    console.log('Получено товаров:', items.length);
    
    // Создаем массив карточек
    const cards = items.map((item) => {
        // Клонируем шаблон
        const container = cloneTemplate<HTMLElement>(cardCatalogTemplate);
        
        // Создаем карточку
        const card = new CardGallery(
            container,
            {
                onClick: () => productsModel.setPreview(item)
            }
        );
        
        // Рендерим карточку и возвращаем её
        return card.render({
            id: item.id,
            image: item.image,
            title: item.title,
            price: item.price,
            category: item.category
        });
    });
    
    // Присваиваем массив карточек каталогу галереи
    gallery.catalog = cards;
});

// Запускаем загрузку товаров
api.getProducts()
    .then(productsModel.setProducts.bind(productsModel))
    .catch((err) => {
        console.error('Ошибка загрузки товаров:', err);
    });

/*events.on('items:change', () => {
    // Получаем все товары из модели
    const products = productsModel.getProducts();
    
    if (!products) return;

    // Создаем массив карточек
    const cards: HTMLElement[] = products.map(product => {
        // Клонируем шаблон карточки
        const template = cloneTemplate(cardCatalogTemplate);
        
        // Создаем экземпляр карточки
        const card = new CardGallery(template.content.firstElementChild, {
            onPreview: () => {
                // Открываем превью товара
                productsModel.setPreview(product);
                events.emit('showProductPreview', product);
            }
        });

        return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
    });

    // Устанавливаем карточки в галерею
    gallery.catalog = cards;
});
*/



/*
// Открыть корзину
events.on('basket:open', () => {
	basketView.disabledButton= basketModel.getTotalCount() === 0;
	modal.render({
		content: basketView.render(),
	});
});
*/

/*
// Cпособ использования промиса
api.getProducts()
  .then((products: IProduct[]) => {
    // Проверяем, что получили массив продуктов
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Массив продуктов пуст');
    }
    
    // Устанавливаем продукты в модель
    Products.setProducts(products);
    
    // Выводим полученные продукты
    console.log('Полученные продукты:', Products.getProducts());
    
    // Дополнительно можно проверить отдельные продукты
    console.log('Первый продукт:', Products.getProductById(products[0].id));
  })
  .catch((error: Error) => {
    console.error('Произошла ошибка при получении продуктов:', error.message);
  });*/
/*ТЕСТИРОВАНИЕ МОДЕЛИ ТОВАРА
 const testproducts = [
    {
        id: "1",
        description: "...",
        image: "...",
        title: "...",
        category: "...",
        price: 1000
    },
    {
        id: "2",
        description: "...",
        image: "...",
        title: "...",
        category: "...",
        price: 2000
    }
];
Products.setProducts(testproducts);+
console.log(Products.getProducts()); // Выведет все продукты+
console.log(Products.getProductById("1")); // Выведет продукт с ID 1+
console.log(Products.setPreview()); // Установит превью, не поняла работает ли
console.log(Products.getPreview()); // Выведет превью продуктов , не поняла работает ли */

 
/* //ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ
всё работает // Тестирование методов
Buyer.setData('email', 'test@example.com');
Buyer.setData('phone', '+79991234567');
Buyer.setData('address', 'г. Москва, ул. Примерная, д. 1');
Buyer.setData('payment', 'online');

console.log(Buyer.getBuyerData());

// Проверка валидации
const data = {
    payment: 'online',
    address: 'г. Москва',
    email: 'test@example.com',
    phone: '+79991234567'
};

console.log(Buyer.validationData(data)); // Должно вернуть true

Buyer.clear();
console.log(Buyer.getBuyerData()); // Должны быть пустые значения*/

/*
//ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ
// Создаем тестовый продукт
const testProduct: IProduct = {
 id: "1",
 description: "Описание",
 image: "image.jpg",
 title: "Товар 1",
 category: "Категория",
 price: 1000
};

const testProductsec: IProduct = {
 id: "2",
 description: "Описание",
 image: "image.jpg",
 title: "Товар 2",
 category: "Категория",
 price: 2000
};

// Тестовые случаи
console.log("Исходная корзина:", Basket.getItems()); // Должна быть пустая
console.log("Количество товаров:", Basket.getTotalCount()); // 0
console.log("Есть ли товар 1?", Basket.hasItem("1")); // false
console.log("Общая сумма:", Basket.getTotal()); // 0

// Добавляем товар
Basket.addProduct(testProduct);
console.log("После добавления товара 1:", Basket.getItems());
console.log("Количество товаров:", Basket.getTotalCount()); // 1
console.log("Есть ли товар 1?", Basket.hasItem("1")); // true
console.log("Общая сумма:", Basket.getTotal()); // 1000

// // Добавляем ещё товар
Basket.addProduct(testProductsec);
console.log("После добавления товара 2:", Basket.getItems());
console.log("Количество товаров:", Basket.getTotalCount()); // 2
console.log("Есть ли товар 2?", Basket.hasItem("2")); // true
console.log("Общая сумма:", Basket.getTotal()); // 3000

// Удаляем товар
Basket.removeProduct("1");
console.log("После удаления товара 1:", Basket.getItems());
console.log("Количество товаров:", Basket.getTotalCount()); // 1
console.log("Есть ли товар 1?", Basket.hasItem("1")); // false
console.log("Общая сумма:", Basket.getTotal()); // 2000 */

/*
//ТЕСТ КЛАССА ХЕДЕР
// Пример использования
const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);

// Теперь можно безопасно вызвать:
header.basketButton.click();
header.counter=6;
*/
/*
//ПРОВЕРКА КЛАССА Gallery
// Функция для создания HTML-карточки товара
const createProductCard = (product: IProduct): HTMLElement => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    
    // Создаем элементы карточки
    const title = document.createElement('h3');
    title.textContent = product.title;
    card.appendChild(title);
    
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.title;
    card.appendChild(image);
    
    const price = document.createElement('span');
    price.textContent = `$${product.price}`;
    card.appendChild(price);
    
    return card;
};
const gallerycontainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(gallerycontainer, events);
// Создаем тестовые продукты
const testProductOne: IProduct = {
    id: "1",
    description: "Описание товара 1",
    image: "image1.jpg",
    title: "Товар 1",
    category: "Категория 1",
    price: 1000
};

const testProductTwo: IProduct = {
    id: "2",
    description: "Описание товара 2",
    image: "image2.jpg",
    title: "Товар 2",
    category: "Категория 2",
    price: 2000
};

// Создаем массив продуктов
const testProducts: IProduct[] = [testProductOne, testProductTwo];

// Преобразуем продукты в HTML-элементы
const productCards: HTMLElement[] = testProducts.map(createProductCard);

// Устанавливаем карточки в галерею
gallery.catalog= productCards;

// Проверка работы
console.log('Количество карточек в галерее:', gallerycontainer.children.length); // Должно быть 2*/


/*// Тестирование класса Modal ПРОВЕРИТЬ ПОЗЖЕ,КОГДА БУДЕТ ВОЗМОЖНОСТЬ ОТКРЫТЬ МОДАЛКУ
const modal = new Modal(, events);*/
/*
// Создаем тестовый HTML-контент
const testTemplate = `
<div class="card">
    <h2 class="card__title"></h2>
    <span class="card__price"></span>
    <button class="card__button">В корзину</button>
</div>
`;

// Добавляем шаблон в документ для тестирования
const testContainer = document.createElement('div');
testContainer.innerHTML = testTemplate;
document.body.appendChild(testContainer);

// Создаем экземпляр карточки
const testCard = new CardProduct(testContainer, {
    onClick: (event) => {
        console.log('Карточка нажата:', event);
    }
});

// Запускаем тестирование
testCard.render();
// Проверяем установку данных
testCard.price = 1000; 
testCard.title='пример названия'
// Выводим результат в консоль
console.log('Данные карточки:', testCard.price);
*/
const testProduct = {
    image: "image1.jpg",
    title: "Товар 1",
    category: "Категория 1",
    price: 1000
};
