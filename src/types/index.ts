
import { EventEmitter } from '../components/base/events';
//СЛОЙ ДАННЫХ

// Описание товара (из API)
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
//Интерфейс для модели данных 

export interface IProductsModel {
    getProducts(): IProduct[] | undefined;
    setProducts(products: IProduct[]): void;
    getProductById(productId: string): IProduct | undefined;
    setPreview (product: IProduct): void;
	getPreview(): IProduct | null;
}

// Интерфейс для описания покупателя (переделала по видео для исправления в классе заказа(переименован на класс Покупатель))
export type PaymentMethod = 'cash' | 'online';

export interface IBuyer {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс для модели покупателя
export interface IBuyerModel {
    setData(data: keyof IBuyer, value: string | PaymentMethod): void;
    validate(data: Record<keyof IBuyer, string>): boolean;
  get order(): IOrder;
    clear(): void;
	formErrors: FormErrors;
}

// Заказ, отправляемый из корзины на сервер
export interface IOrder extends IBuyer {
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

//Интерфейс модели корзины

export interface IBasketModel {
	
	  getItems(): Map<string, IProduct>; //получить список товаров
	  getTotalCount(): number;//получить количество товаров в корзине
	  hasItem(id: string): boolean; //узнать наличие товара
	  getTotal(): number; //вывести общую стоимомть корзины.
	  addProduct(product: IProduct): void //добавить товар в корзину
	  removeProduct(id: string): void; //удалить 
	  clear(): void; //очищение всей корзины
	}

//ТИПЫ ПРЕДСТАВЛЕНИЯ

//Интерфейс для класса Header
export interface IHeader {
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
export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
	render(data: IModalView): HTMLElement;
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
	payment: PaymentMethod;
	address: string;
}
export interface IFormContactsData {
	email: string;
	phone: string;
}
//Интерфейс для апи
export interface ILarekAPI {
	// Получить каталог товаров
	getProducts(): Promise<IProduct[]>;
	//Получить товар по id 
	getProduct(id: string): Promise<IProduct>;
	//Создать заказ
	createOrder(order: IOrder): Promise<IOrderResult>;
}
