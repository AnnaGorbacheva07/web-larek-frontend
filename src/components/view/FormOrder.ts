import { IFormOrderData, PaymentMethod, IForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class FormOrder extends Form<IFormOrderData> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = Array.from(
      this.container.querySelectorAll('button[name="card"], button[name="cash"]')
    );
		this._addressInput = this.container.querySelector('input[name="address"]')!;

		// Добавляем обработчики на кнопки оплаты
 this._paymentButtons.forEach((button) => {
 button.addEventListener('click', () => {
 
		 // Явное приведение типа к PaymentMethod
		 this.inputChange('payment',  button.name as PaymentMethod);
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

	
	/*
	 * Переопределяем render, чтобы при повторном показе формы
	 * активная кнопка соответствовала состоянию модели
	 
	render(state: Partial<IFormOrderData> & IForm) {
		// вызываем базовый рендер для установки адреса/валидности/ошибок
		super.render(state);

		// state.payment может быть undefined (при первом рендере)
		this._togglePaymentActive(state.payment ?? null);
		return this.container;
	}
	*/
}