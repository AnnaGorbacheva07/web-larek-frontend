import { FormErrors, IForm } from "../../types"
import { ensureElement } from "../../utils/utils";
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
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		
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
		

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
	}

	// Обработчик для инициации события изменений в форме

	protected inputChange(field: keyof T, value: string) {
		const form = this.container as HTMLFormElement;
		this.events.emit(`${form.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
	protected _submit: HTMLButtonElement;
	set valid(value: boolean) {
		this._submit.disabled = !value;
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
