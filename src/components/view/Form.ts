import { IForm } from "../../types"
import { EventEmitter, IEvents } from "../base/events"
import { Component } from "../component"


export class Form<T> extends Component<IForm>{
	protected _submitButton: HTMLButtonElement | null = null;
 protected _errors:  HTMLElement | null = null;;
 protected events: EventEmitter;

 constructor(container: HTMLFormElement, events: IEvents) {
 super(container);
 this.events = new EventEmitter();
 
 // Поиск элементов с проверкой существования
 this._submitButton = this.container.querySelector('.order__button');
 this._errors = this.container.querySelector('.form__errors');

 // обработчик изменения полей
 this.container.addEventListener('input', (e: Event) => {
 const target = e.target as HTMLInputElement;
 if (!target.name) return;
 const field = target.name as keyof T;
 const value = target.value;
 this.inputChange(field, value);
 });

 // обработка отправки формы
 this.container.addEventListener('submit', (e: Event) => {
 e.preventDefault();
 const form = this.container as HTMLFormElement; // Явное приведение типа
 this.events.emit(`${form.name}:submit`);
 });
 }

 //Обработчик для инициации события изменений в форме

 protected inputChange(field: keyof T, value: string) {
 const form = this.container as HTMLFormElement; // Явное приведение типа
 this.events.emit(`${form.name}.${String(field)}:change`, {
 field,
 value,
 });
 }
set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	/**
	 * Установить ошибки валидации
	 */
	set errors(list: string[]) {
		this.setText(this._errors, list.join(', '));
	}

	/**
	 * Рендер формы
	 */
	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
	

	