
import {IBuyerModel, IBuyer, IOrder, PaymentMethod, FormErrors, IBasketModel } from "../../../src/types/index";
import {IEvents} from "../../components/base/events";
import { BasketModel } from "./basketModel";

export class BuyerModel implements IBuyerModel {
	// Данные, введенные покупателем
	_buyer: IBuyer = {
		payment: null,
		address: '',
		email: '',
		phone: ''
	};

	_order: IOrder = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: []
	};

// Добавляем зависимость от BasketModel
	private basketModel: BasketModel;
	formErrors: FormErrors = {};
	protected events: IEvents; // Экземпляр класса EventEmitter

	constructor(events: IEvents,basketModel: BasketModel) {
		this.events = events;
		this.basketModel = basketModel;
	}

	// Получение данных заказа
	get order(): IOrder {
		return {
			...this._buyer,
			total: this.basketModel.getTotal(), // Получаем актуальную сумму
			items: Array.from(this.basketModel.getItems().keys()) // Получаем массив ID товаров
		};
	}



	// Сохранение (обновление) данных
	setData(data: keyof IBuyer, value: string | PaymentMethod): void {
		if (data === 'payment') {
			// Проверяем, что значение соответствует допустимым вариантам
			if (
				typeof value === 'string' &&
				(value === 'cash' || value === 'online')
			) {
				this._buyer[data] = value as PaymentMethod;
			}
		} else {
			this._buyer[data] = value as string;
		}

		// Валидация полей
		this.validate();

		// Эмиттим событие обновления данных
		this.events.emit('buyer:data:updated', this._buyer);
	}

	// Метод валидации
	validate(): boolean {
		const errors: typeof this.formErrors = {};
		const { payment, address, email, phone } = this._buyer;

		// Проверка способа оплаты
		if (!payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		// Проверка адреса
		if (!address || address.trim() === '') {
			errors.address = 'Необходимо указать адрес';
		}

		// Проверка email
		if (!email || email.trim() === '') {
			errors.email = 'Необходимо указать email';
		}

		// Проверка телефона
		if (!phone || phone.trim() === '') {
			errors.phone = 'Необходимо указать телефон';
		}

		// Определяем общую валидность
		const isValid = Object.keys(errors).length === 0;

		// Определяем валидность частей формы
		const orderValid = !errors.payment && !errors.address;
		const contactsValid = !errors.email && !errors.phone;

		// Эмиттим события готовности
		if (orderValid) {
			this.events.emit('order:ready', this._buyer);
		}
		if (contactsValid) {
			this.events.emit('contacts:ready', this._buyer);
		}

		// Обновляем ошибки
		this.formErrors = errors;
		this.events.emit('validation:error', this.formErrors);
		return isValid;
	}

	// Вспомогательные методы валидации
	private validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private validatePhone(phone: string): boolean {
		const phoneRegex = /^\+?\d{10,15}$/;
		return phoneRegex.test(phone);
	}

	// Очистить данные заказа
	clear(): void {
		this._buyer = {
			payment: null,
			address: '',
			email: '',
			phone: ''
		};
		this.formErrors = {};
		this.events.emit('buyer:data:cleared');
	}
}
