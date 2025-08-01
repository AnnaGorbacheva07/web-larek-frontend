import { IBasketModel, IProduct } from '../../../src/types/index';
import { IEvents } from '../../components/base/events';

export class BasketModel implements IBasketModel {
	protected _items: Map<string, IProduct> = new Map();  
    events: IEvents; //экземпляр класса `EventEmitter` для инициации событий при изменении данных.

	constructor(events: IEvents) {
		this.events = events;
	}
	//получить список товаров
	getItems(): Map<string, IProduct>
        {
		return this._items;
	}
	//получить количество товаров в корзине
	getTotalCount(): number {
		return this._items.size;
	}
	//узнать наличие товара
	hasItem(id: string): boolean {
		return this._items.has(id);
	}
	//вывести общую стоимомть корзины.
	getTotal(): number {
		return Array.from(this._items.values()).reduce(
			(total, item) => total + item.price,
			0
		);
	}
	//добавить товар в корзину
  
	addProduct (product: IProduct): void {
    // Товары без цены добавлять нельзя
    if (product.price === null) {
			return;
		}

		this._items.set(product.id,{...product});
		this.events.emit('basket:changed', this.getItems());
	}
  
	//удалить товар из корзины
	removeProduct(id: string): void {
    this._items.delete(id);
    this.events.emit('basket:changed', this.getItems());
  }

	//очищение всей корзины
	clear(): void {
    this._items.clear();
    this.events.emit('basket:changed', this.getItems());
  }}
