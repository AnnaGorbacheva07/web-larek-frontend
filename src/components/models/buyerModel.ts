
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
        items: [] as string[],
    };
    
// Добавляем зависимость от BasketModel
    private basketModel: BasketModel;
    formErrors: FormErrors = {};
    protected events: IEvents; // Экземпляр класса EventEmitter

    constructor(events: IEvents,basketModel: BasketModel) {
        this.events = events; 
this.basketModel = basketModel;
    }
/*
    // Получение данных заказа
    get order(): IOrder {
        return {
            ...this._buyer,
            total: this.basketModel.getTotal(), // Получаем актуальную сумму
            items: Array.from(this.basketModel.getItems().keys()) // Преобразуем Map в массив
           /* items: Array.from(this.basketModel.getItems().values()) // Преобразуем Map в массиd*/
        


       
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
/*export class BuyerModel implements IBuyerModel {
    // Данные, введенные покупателем
    protected _buyer: IBuyer = {
        payment: null,
        address: '',
        email: '',
        phone: ''
    };

    protected _order: IOrder = {
        payment: null,
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };

    formErrors: FormErrors = {};
    protected events: IEvents; // Экземпляр класса EventEmitter

    constructor(events: IEvents) {
        this.events = events;
    }

    // Получение данных заказа
    get order(): IOrder {
        return {
            ...this._buyer,
            total: this._order.total,
            items: this._order.items
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
}*/
/*
export class BuyerModel implements IBuyerModel {
   //данные, введенные покупателем.
   protected _buyer: IBuyer = {
        payment: null,
        address: '',
        email: '',
        phone: ''
    };
    protected _order: IOrder = {
        payment: null,
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    formErrors: FormErrors = {};
   protected events: IEvents; //экземпляр класса `EventEmitter` для инициации событий при изменении данных.

   constructor(events: IEvents) {
		this.events = events;
	}

//сохранение(обновление) данных в момент заполнения данных покупателем.
setData(data: keyof IBuyer, value: string): void {
        {
        
        if (data === 'payment') {
            // Проверяем, что значение соответствует допустимым вариантам
            
                this._buyer[data] = value as PaymentMethod;
            } else {
                this._buyer[data] = value as string;
            }
        
        this.events.emit('buyer:data:updated', this._buyer);
    }
    }*/
/*//проверка валидации полей формы при оформлении заказа.

     validationData(data: Record<keyof IBuyer, string>): boolean {
        // Проверяем, что все поля заполнены
    const isValidEmail = data.email.trim() !== '';
    const isValidPhone = data.phone.trim() !== '';
    const isValidAddress = data.address.trim() !== '';
    const isValidPayment = data.payment !== '';

    // Общая валидация
    const isValid = isValidEmail && isValidPhone && isValidAddress && isValidPayment;

    if (!isValid) {
        this.events.emit('validation:error', {
            email: !isValidEmail,
            phone: !isValidPhone,
            address: !isValidAddress,
            payment: !isValidPayment
        });
    }

    return isValid;
}
    

//получение данных заказа
get order(): IOrder {
    return {
        ...this._buyer,
        total: this._order.total,
        items: this._order.items
    };
}*//*
// Валидация данных
    validationData(): boolean {
        const { email, phone, address, payment } = this._buyer;
        
        // Очищаем ошибки
        this.formErrors = {};

        // Проверяем email
        const isValidEmail = this.validateEmail(email);
        if (!isValidEmail) {
            this.formErrors.email = 'Неверный email';
        }

        // Проверяем телефон
        const isValidPhone = this.validatePhone(phone);
        if (!isValidPhone) {
            this.formErrors.phone = 'Неверный телефон';
        }

        // Проверяем адрес
        const isValidAddress = address.trim() !== '';
        if (!isValidAddress) {
            this.formErrors.address = 'Адрес обязателен';
        }

        // Проверяем способ оплаты
        const isValidPayment = payment !== null;
        if (!isValidPayment) {
            this.formErrors.payment = 'Выберите способ оплаты';
        }

        // Общая валидация
        const isValid = Object.keys(this.formErrors).length === 0;

        if (!isValid) {
            this.events.emit('validation:error', this.formErrors);
        }

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

    // Получение данных заказа
    get order(): IOrder {
        return {
            ...this._buyer,
            total: this._order.total,
            items: this._order.items
        };
    }

    //очистить данные заказа.
clear(): void {
        this._buyer = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
        this.events.emit('buyer:data:cleared');
    }}*/


    
/*
/* //проверка валидации полей формы при оформлении заказа.

     validationData(data: Record<keyof IBuyer, string>): boolean {
        // Проверяем, что все поля заполнены
    const isValidEmail = data.email.trim() !== '';
    const isValidPhone = data.phone.trim() !== '';
    const isValidAddress = data.address.trim() !== '';
    const isValidPayment = data.payment !== '';

    // Общая валидация
    const isValid = isValidEmail && isValidPhone && isValidAddress && isValidPayment;

    if (!isValid) {
        this.events.emit('validation:error', {
            email: !isValidEmail,
            phone: !isValidPhone,
            address: !isValidAddress,
            payment: !isValidPayment
        });
    }

    return isValid;
}

    
*/

/*
// Валидация данных
    validationData(): boolean {
        const { email, phone, address, payment } = this._buyer;
        
        // Очищаем ошибки
        this.formErrors = {};

        // Проверяем email
        const isValidEmail = this.validateEmail(email);
        if (!isValidEmail) {
            this.formErrors.email = 'Неверный email';
        }

        // Проверяем телефон
        const isValidPhone = this.validatePhone(phone);
        if (!isValidPhone) {
            this.formErrors.phone = 'Неверный телефон';
        }

        // Проверяем адрес
        const isValidAddress = address.trim() !== '';
        if (!isValidAddress) {
            this.formErrors.address = 'Адрес обязателен';
        }

        // Проверяем способ оплаты
        const isValidPayment = payment !== null;
        if (!isValidPayment) {
            this.formErrors.payment = 'Выберите способ оплаты';
        }

        // Общая валидация
        const isValid = Object.keys(this.formErrors).length === 0;

        if (!isValid) {
            this.events.emit('validation:error', this.formErrors);
        }

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

    // Получение данных заказа
    get order(): IOrder {
        return {
            ...this._buyer,
            total: this._order.total,
            items: this._order.items
        };
    }
*/
    /*
    // Получение данных заказа
    get order(): IOrder {
        return {
            ...this._buyer,
            total: this.basketModel.getTotal(), // Получаем актуальную сумму
            items: Array.from(this.basketModel.getItems().keys()) // Преобразуем Map в массив
            items: Array.from(this.basketModel.getItems().values()) // Преобразуем Map в массив*/
        
    

