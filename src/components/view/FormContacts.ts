import { IForm, IFormContactsData } from "../../types";
import { EventEmitter, IEvents } from "../base/events";
import { Form } from "./Form";

export class FormContacts extends Form<IFormContactsData> implements IForm {
 
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events:EventEmitter) {
		super(container, events);

		this._emailInput = this.container.querySelector('input[name="email"]');
		this._phoneInput = this.container.querySelector('input[name="phone"]');
	}

	/**
	 * Установить email
	 */
	set email(value: string) {
		this._emailInput.value = value;
	}

	/**
	 * Установить телефон
	 */
	set phone(value: string) {
		this._phoneInput.value = value;
	}
}