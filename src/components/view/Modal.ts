import { IModal, IModalView } from "../../types"
import { EventEmitter, IEvents } from "../base/events"
import { Component } from "../component"

  export class Modal extends Component<IModalView> implements IModal {
    protected events: EventEmitter;
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        // Находим элементы
        this._content = this.container.querySelector('.modal__content');
        this._closeButton = this.container.querySelector('.modal__close');
this._closeButton.addEventListener('click', () =>
			this.events.emit('modal:close', {source: 'button'})
		);


        // Слушаем закрытие по Esc и клику на оверлей
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
               this.events.emit('modal:close', {source: 'escape'})
            }
        });

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.events.emit('modal:close', {source: 'overlay'})
            }
        });
    }

    // Метод для открытия модального окна
     open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

    // Метод для закрытия модального окна
   close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = document.createElement('div');//очищение
		this.events.emit('modal:close');
	}

    // Метод для отображения содержимого модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
/*
    // Метод для получения содержимого
    get content(): HTMLElement {
        return this._content;
    }*/
    render(data: IModalView): HTMLElement {
        super.render(data);
		this.open();
		return this.container;
    }
}
      