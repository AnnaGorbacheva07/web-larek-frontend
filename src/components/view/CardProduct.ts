import { ICard, ICardActions } from "../../types"
import { EventEmitter } from "../base/events";
import { Component } from "../component";

 export class CardProduct extends Component<ICard>{
    protected events: EventEmitter;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement | null = null;
  

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
	/*// Проверяем существование элементов
    if (!this._title || !this._price) {
        console.error('Не найдены основные элементы карточки');
    }*/
    this.events = new EventEmitter();

    // Поиск элементов в DOM
    this._title = this.container.querySelector('.card__title');
    this._price = this.container.querySelector('.card__price');
    this._button = this.container.querySelector('.card__button') || 
                      this.container.querySelector('.basket__item-delete');

    // Подписка на события
    if (actions?.onClick) {
			container.addEventListener('click', (event: MouseEvent) => {
				// Если у карточки есть собственная кнопка, реагируем только на клики по ней
				if (this._button) {
					if (
						event.target === this._button ||
						(this._button.contains(event.target as Node) &&
							event.currentTarget !== this._button)
					) {
						actions.onClick(event);
					}
				} else {
					// Если кнопки нет, достаточно клика по любой области карточки
					actions.onClick(event);
				}
			});
		}
	}
set title(value: string) {
		this.setText(this._title, value);
	}
    set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		}
	}
 