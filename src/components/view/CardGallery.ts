import {CategoryType, ICard, ICardActions } from '../../types';

import { CardProduct } from './CardProduct';

export class CardGallery extends CardProduct {
	
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		

		// Поиск элементов в DOM
		this._image = this.container.querySelector('.card__image');
		this._category = this.container.querySelector('.card__category');
		
	}
	set image(value: string) {
		const alt = this._title.textContent || '';
		this.setImage(this._image, value, alt);
	}
	
   set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			'card__category_soft',
			value === 'софт-скил'
		);
		this.toggleClass(
			this._category,
			'card__category_other',
			value === 'другое'
		);
		this.toggleClass(
			this._category,
			'card__category_additional',
			value === 'дополнительное'
		);
		this.toggleClass(
			this._category,
			'card__category_button',
			value === 'кнопка'
		);
		this.toggleClass(
			this._category,
			'card__category_hard',
			value === 'хард-скил'
		);
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

