
import {IBuyerModel, IBuyer, IOrder, PaymentMethod, FormErrors } from "../../../src/types/index";
import {IEvents} from "../../components/base/events";

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
    }
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
}*/
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
    }}

