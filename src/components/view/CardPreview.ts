import { ICardActions } from "../../types";
import { CardProduct } from "./CardProduct";

export class PreviewCard extends CardProduct {
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLElement;


    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        // Специфичные элементы для предпросмотра
        this._description = this.container.querySelector('.card__text');
        this._image = this.container.querySelector('.card__image');
        this._button = this.container.querySelector('.card__button');
        this._category = this.container.querySelector('.card__category');
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        const alt = this._title.textContent || '';
        this.setImage(this._image, value, alt);
    }
//установить текст кнопки
    set button(value: string) {
		this.setText(this._button, value);
	}
    set category(value: string) {
        this.setText(this._category, value);
    }
}