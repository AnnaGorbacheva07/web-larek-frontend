import './scss/styles.scss';
import {  EventEmitter } from './components/base/events';
import { ProductsModel } from './components/models/productsModel';
import { BuyerModel } from './components/models/buyerModel';
import { BasketModel } from './components/models/basketModel';
import { IBuyer, ICard, IFormContactsData, IFormOrderData, IProduct, PaymentMethod } from './types';
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
import { PreviewCard } from './components/view/CardPreview';
import { BasketCard } from './components/view/CardBasket';

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
const modalContainer = document.querySelector('.modal') as HTMLElement;
if (!modalContainer) {
    console.error('Контейнер модального окна не найден в DOM');
    throw new Error('Контейнер модального окна не найден');
}
const basketContainer = cloneTemplate<HTMLElement>(basketTemplate);

const orderContainer = cloneTemplate<HTMLFormElement>(orderTemplate);

const contactsContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);
/*
const successContainer = document.querySelector('.success__container') as HTMLElement;
*/
// Экземпляры модели данных
const productsModel = new ProductsModel(events);
const buyerModel = new BuyerModel(events);
const basketModel = new BasketModel(events);

// Экземпляры классов представления
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer, events);

const modal = new Modal(modalContainer, events);

// Дополнительные представления
const basket = new Basket(basketContainer, events);

const orderForm = new FormOrder(orderContainer, events);

const contactsForm = new FormContacts(contactsContainer, events);
/*
const successView = new SuccessOrder(successContainer, {
	onClick: () => {
		modal.close();
	},
});*/

// Обработчик загрузки товаров
events.on('items:change', (items: IProduct[]) => {
    console.log(items);
  gallery.catalog = items.map(item => {
    const card = new CardGallery(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('card:select', item);
      }
    })
    return card.render(item);
  })
});
// Изменение открытого выбранного товар
events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (basketModel.hasItem(item.id)) {
					// удаляем товар из корзины
					basketModel.removeProduct(item.id);
				} else {
					// добавляем товар в корзину
					basketModel.addProduct(item);
				}

				// вне зависимости от действия обновляем отображение превью
				productsModel.setPreview(item);
			},
		});

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
				button: basketModel.hasItem(item.id) ? 'Удалить из корзины' : 'В корзину',
			}),
            
	});
    
	};

	if (item) {
		// Товар уже есть в productsModel, повторный запрос к API не нужен
		showItem(item);
	} else {
		modal.close();
	}
});

// Обработчик выбора карточки
events.on('card:select', (item: IProduct) => {
    // Логика при выборе карточки
    console.log('Выбрана карточка:', item);
    // Например, открытие превью товара
    productsModel.setPreview(item);
});

    // Изменения в корзине
events.on('basket:changed',() => {
header.counter = basketModel.getTotalCount();
// Получаем элементы корзины и преобразуем их в массив
    const itemsArray = Array.from(basketModel.getItems().values());
    
    // Преобразуем товары в элементы корзины
    basket.items = itemsArray.map((item, index) => {
        const card = new BasketCard(
            cloneTemplate(cardBasketTemplate),
            {
                onClick: () => {
                    basketModel.removeProduct(item.id);
                    
                }
            }
        );
        
        const element = card.render({
            id: item.id,
            title: item.title,
            price: item.price
        });
        
        // Устанавливаем индекс товара
        const indexElement = element.querySelector('.basket__item-index');
        if (indexElement) {
            indexElement.textContent = String(index + 1);
        }
        
        return element;
    });
    
    // Обновляем общую сумму и состояние кнопки
    basket.total = basketModel.getTotal();
    basket.disabledButton = basketModel.getTotalCount() === 0;
});
  
    // Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
   
	});

    //открыть форму заказа
    events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});
/*
// Обработчик ошибок
events.on('formErrors:change', (errors:Partial<IFormOrderData & IFormContactsData>) => {
    const { payment, address, email, phone } = errors;

    // Для формы заказа
    orderForm.valid = !payment && !address;
    orderForm.errors = [payment, address]
        .filter(Boolean) // Фильтруем пустые значения
        .filter(error => typeof error === 'string'); // Оставляем только строки

    // Для контактной формы
    contactsForm.valid = !email && !phone;
    contactsForm.errors = [phone, email]
        .filter(Boolean) // Фильтруем пустые значения
        .filter(error => typeof error === 'string'); // Оставляем только строки
});

	// Обработка событий формы заказа
events.on(/^order\..*:change/, (data: { field: keyof IFormOrderData; value: string }) => {
  // Обновляем модель заказа
  buyerModel.setData(data.field, data.value);

  // Вычисляем валидность
  const orderValid = !buyerModel.formErrors.payment && !buyerModel.formErrors.address;
  const orderErrors = Object.values({
    payment: buyerModel.formErrors.payment,
    address: buyerModel.formErrors.address
  }).filter((e): e is string => Boolean(e));

  // Рендерим форму
  orderForm.render({
    payment: buyerModel.order.payment,
    address: buyerModel.order.address,
    valid: orderValid,
    errors: orderErrors
  });
});	
// В обработчике событий:
events.on(/^order\.payment:change/, (data: { field: keyof IFormOrderData; value: PaymentMethod }) => {
 // Обновляем модель
 buyerModel.setData('payment', data.value);
 
 // Выполняем валидацию
 buyerModel.validationData();
 
 // Обновляем интерфейс
 orderForm.render({
 payment: data.value,
 valid: buyerModel.validationData(),
 errors: Object.values(buyerModel.formErrors)
 .filter(Boolean)
 .filter(error => typeof error === 'string')
 });
});
*/
    // Запускаем загрузку товаров
api.getProducts()
    .then(productsModel.setProducts.bind(productsModel))
    .catch((err) => {
        console.error('Ошибка загрузки товаров:', err);
    });
