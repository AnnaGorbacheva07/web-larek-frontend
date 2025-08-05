import { FormErrors, IForm } from "../../types"
import { EventEmitter, IEvents } from "../base/events"
import { Component } from "../component"
export class Form<T> extends Component<IForm> {
	protected _submitButton: HTMLButtonElement | null = null;
	protected _errors: HTMLElement | null = null;
	protected events: EventEmitter;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container as HTMLElement);
		this.events = events;
		// Убедимся, что контейнер является формой
		if (!(container instanceof HTMLFormElement)) {
			throw new Error('Container must be an HTMLFormElement');
		}
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
			const form = this.container as HTMLFormElement;
			this.events.emit(`${form.name}:submit`);
		});
/*
		// Subscribe to validation errors
		this.events.on('validation:error', (errors: FormErrors) => {
			const formErrors = Object.values(errors)
				.filter(Boolean)
				.filter((error): error is string => typeof error === 'string');
			this.errors = formErrors;
			this.valid = formErrors.length === 0;
		});*/
	}

	// Обработчик для инициации события изменений в форме

	protected inputChange(field: keyof T, value: string) {
		const form = this.container as HTMLFormElement;
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
/*
export class Form<T> extends Component<IForm>{
	protected _submitButton: HTMLButtonElement | null = null;
 protected _errors:  HTMLElement | null = null;
 protected events: EventEmitter;

 constructor(container: HTMLFormElement, events: EventEmitter) {
 super(container as HTMLElement );
 this.events = new EventEmitter();
 // Убедимся, что контейнер является формой
 if (!(container instanceof HTMLFormElement)) {
 throw new Error('Container must be an HTMLFormElement');
 }
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
	}*/

	/*
	*
	 * Установить ошибки валидации
	 */
	/*
	set errors(list: string[]) {
		this.setText(this._errors, list.join(', '));
	}

	/**
	 * Рендер формы
	 *//*
	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
	*/

	