import { IFormOrderData, PaymentMethod, IForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { EventEmitter, IEvents } from "../base/events";
import { Form } from "./Form";
export class FormOrder extends Form<IFormOrderData> implements IForm {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
        
        // Обновляем селекторы под текущую разметку
        this._paymentButtons = Array.from(
            this.container.querySelectorAll('button[name="card"], button[name="cash"]')
        );
        
        this._addressInput = this.container.querySelector('input[name="address"]')!;

        // Обновляем обработчики
        this._paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Явное приведение типа к PaymentMethod
                const method = button.name as PaymentMethod;
                this.inputChange('payment', method);
                /*this._togglePaymentActive(method);*/
            });
        });
    }

    // Добавляем метод для установки адреса
    set address(value: string) {
        this._addressInput.value = value;
    }


    // Переопределяем рендер
    render(state: Partial<IFormOrderData> & IForm): HTMLFormElement {
        const result = super.render(state) as HTMLFormElement;
        this._togglePaymentActive(state.payment ?? null);
        return result;
    }
    // Метод управления активностью кнопок
    protected _togglePaymentActive(method: PaymentMethod | null) {
        this._paymentButtons.forEach((button) => {
            // Добавляем отладку для проверки
            console.log('Проверяем кнопку:', button.name, 'с методом:', method);
            this.toggleClass(
                button,
                'button_alt-active',
                button.name === method
            );
        });
    }
}
