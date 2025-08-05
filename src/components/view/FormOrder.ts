import { IFormOrderData, PaymentMethod, IForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { EventEmitter, IEvents } from "../base/events";
import { Form } from "./Form";

export class FormOrder extends Form<IFormOrderData> implements IForm {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
        
        // Проверяем, что контейнер является формой
        if (!(container instanceof HTMLFormElement)) {
            throw new Error('Container must be an HTMLFormElement');
        }
        
        this._paymentButtons = Array.from(
            this.container.querySelectorAll('button[name="card"], button[name="cash"]')
        );
        
        this._addressInput = this.container.querySelector('input[name="address"]')!;

        // Добавляем обработчики на кнопки оплаты
        this._paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Явное приведение типа к PaymentMethod
                this.inputChange('payment', button.name as PaymentMethod);
                
                // Обновляем активное состояние кнопок
                this._togglePaymentActive(button.name as PaymentMethod);
            });
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    protected _togglePaymentActive(method: PaymentMethod | null) {
        this._paymentButtons.forEach((button) => {
            this.toggleClass(button, 'button_alt-active', button.name === method);
        });
    }

    // Переопределяем метод render для обновления состояния кнопок
    render(state: Partial<IFormOrderData> & IForm): HTMLFormElement {
        // Вызываем базовый рендер
        const result = super.render(state) as HTMLFormElement;

        // Обновляем активность кнопок оплаты
        this._togglePaymentActive(state.payment ?? null);

        return result;
    }
}

/*export class FormOrder extends Form<IFormOrderData> implements IForm{
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
// Проверяем, что контейнер является формой
 if (!(container instanceof HTMLFormElement)) {
 throw new Error('Container must be an HTMLFormElement');
 }
		this._paymentButtons = Array.from(
      this.container.querySelectorAll('button[name="card"], button[name="cash"]')
    );
		this._addressInput = this.container.querySelector('input[name="address"]')!;

	

// Добавляем обработчики на кнопки оплаты
this._paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Явное приведение типа к PaymentMethod
        this.inputChange('payment', button.name as PaymentMethod);
        
        // Обновляем активное состояние кнопок
        this._togglePaymentActive(button.name as PaymentMethod);
    });
});


	set address(value: string) {
		this._addressInput.value = value;
	}

	protected _togglePaymentActive(method: PaymentMethod | null) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === method);
		});
	}

	
	// Переопределяем метод render для обновления состояния кнопок
    render(state: Partial<IFormOrderData> & IForm): HTMLFormElement {
        // Вызываем базовый рендер
        const result = super.render(state) as HTMLFormElement;

        // Обновляем активность кнопок оплаты
        this._togglePaymentActive(state.payment ?? null);

        return result;
    }
}
}
*/