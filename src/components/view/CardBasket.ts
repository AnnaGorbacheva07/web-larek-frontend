import { ICardActions } from "../../types";
import { CardProduct } from "./CardProduct";

export class BasketCard extends CardProduct {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        // Специфичные элементы для корзины
        this._index = this.container.querySelector('.basket__item-index')!;
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}