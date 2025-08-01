
import {IBuyerModel, IBuyer, IOrder, PaymentMethod } from "../../../src/types/index";
import {IEvents} from "../../components/base/events";

export class BuyerModel implements IBuyerModel {
   //данные, введенные покупателем.
   protected _buyer: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };
    protected _order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
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
//проверка валидации полей формы при оформлении заказа.

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
getBuyerData(): IOrder {
        return {
            ...this._buyer,
            total: this._order.total,
            items: this._order.items
        };
    }
    //очистить данные заказа.
clear(): void {
        this._buyer = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
        this.events.emit('buyer:data:cleared');
    }}

