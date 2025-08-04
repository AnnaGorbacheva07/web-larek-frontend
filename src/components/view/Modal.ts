import { IModal, IModalView } from "../../types"
import { ensureElement } from "../../utils/utils";
import { EventEmitter, IEvents } from "../base/events"
import { Component } from "../component"

  export class Modal extends Component<IModalView> implements IModal {
    /*protected events: EventEmitter;*/
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    private _events: IEvents;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        // Сохраняем события в приватное поле
        this.events = events;


        // Находим элементы
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        // Добавляем обработчики событий через метод close()
        this._closeButton.addEventListener('click', () => {
            this.close();
        });

        // Обработчик закрытия по Esc
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                this.close();
            }
        });

        // Обработчик клика на оверлей
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
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
      