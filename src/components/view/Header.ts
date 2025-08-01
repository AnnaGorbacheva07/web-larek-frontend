import { IEvents } from "../base/events";
import { Component } from "../component";
import { IHeader} from '../../../src/types/index';


export class Header extends Component<IHeader> {
	protected events: IEvents;
	protected _counter: HTMLElement; //счётчик товаров в корзине
    protected _basketButton: HTMLElement; //кнопка корзины

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._counter = this.container.querySelector('.header__basket-counter');
		this._basketButton = this.container.querySelector('.header__basket');
		
		this._basketButton.addEventListener('click', () =>
			this.events.emit('basket:open', {
                counter: this.counter
            })
		);

	}

    //метод для взаимодействия с данными счётчика.
 set counter(value: number) {
    this.setText(this._counter, String(value));
 }

 // Геттер для получения текущего значения счетчика
    get counter(): number {
        return parseInt(this._counter.textContent, 10) || 0;
    }

//метод для взаимодействия с кнопкой корзины.
 get basketButton(): HTMLElement {
        return this._basketButton;
    }
}
    