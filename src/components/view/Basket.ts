import { IBasket } from "../../types"
import { createElement } from "../../utils/utils"
import { EventEmitter, IEvents } from "../base/events"
import { Component } from "../component"

export class Basket extends Component<IBasket> {
	protected _basketlist: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement | null = null;
protected events: EventEmitter;

 
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
this.events = new EventEmitter();
		this._basketlist = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
	// Добавляем проверку существования элементов
        if (!this._basketlist || !this._total) {
            throw new Error('Не найдены обязательные элементы корзины');
        }

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
		this.disabledButton = true;
	}

	
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._basketlist.replaceChildren(...items);
		} else {
			this._basketlist.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	set disabledButton(value: boolean) {
        if (this._button) {
            this.setDisabled(this._button, value);
        }
    }
}
