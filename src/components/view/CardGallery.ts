import {ICard, ICardActions } from '../../types';

import { CardProduct } from './CardProduct';

export class CardGallery extends CardProduct {
	
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		
/*// Проверяем существование элементов
    if (!this._image || !this._category) {
        console.error('Не найдены элементы карточки');
    }*/
		// Поиск элементов в DOM
		this._image = this.container.querySelector('.card__image');
		this._category = this.container.querySelector('.card__category');
		
	}
	set image(value: string) {
		const alt = this._title.textContent || '';
		this.setImage(this._image, value, alt);
	}
	set category(value: string) {
        this.setText(this._category, value);
    }
	render(data: ICard): HTMLElement {
		console.log('Рендерим карточку:', data);
        this.image = data.image;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        
        return this.container;
    }
}

