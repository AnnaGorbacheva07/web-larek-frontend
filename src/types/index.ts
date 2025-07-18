import { EventEmitter } from '../components/base/events';
//СЛОЙ ДАННЫХ

// Типы, относящиеся к товару
// Описание товара (из API)
export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//Список товаров (из API)
export interface IProductsList {
	total: number;
	items: IProduct[];
}

// Типы для оформления заказа

//  Информация об оплате и доставке
export interface IBuyerData {
	payment: 'cash' | 'online' | '';
	address: string;
}

// Контактные данные покупателя
export interface IBuyerContacts {
	email: string;
	phone: string;
}

// Заказ, отправляемый из корзины на сервер
export interface IOrder extends IBuyerData, IBuyerContacts {
	total: number;
	items: string[]; // массив id товаров
}
// Ответ сервера о  заказе
export interface IOrderResult {
	id: string;
	total: number;
}
// Ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//ТИПЫ ПРЕДСТАВЛЕНИЯ

//Интерфейс для класса Header
interface IHeader {
	counter: number;
}

// Интерфейс списка карточек на главной странице
export interface IGallery {
	catalog: HTMLElement[];
}

//Интерфейс для отображения модального окна
export interface IModalView {
	content: HTMLElement;
}

// Интерфейс окна «Заказ оформлен»
export interface ISuccess {
	total: number;
}
//Интерфейс, описывающий возможные действия с данным окном
export interface ISuccessActions {
	onClick: () => void;
}

// Интерфейс для отображения карточки товара
// Карточка товара с обязательными и необязательными полями
export type ICard = Pick<IProduct, 'id' | 'title' | 'price'> &
	Partial<Pick<IProduct, 'image' | 'category' | 'description'>> & {
		button?: string;
	};
// Интерфейс, описывающий возможные действия с карточкой товара
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
//Интерфейс корзины с товарами
export interface IBasket {
	items: HTMLElement[];
	total: number;
}

// Интерфейс формы
export interface IForm {
	valid: boolean;
	errors: string[];
}
export interface IFormOrderData {
	address: HTMLInputElement;
}
export interface IFormContactsData {
	email: HTMLInputElement;
	phone: HTMLInputElement;
}
/*МОЖЕТ БЫТЬ НУЖЕН?
//Интерфейс для конструктора
export interface IViewСonstructor {
	new (container: HTMLElement, events?: EventEmitter): IView; //на входе контейнер,в который будем выводить
}
//Интерфейс для класса отображения
export interface IView {
	render(data?: object): HTMLElement; //устанавливаем данные и возвращаем контейнер
}
*/
