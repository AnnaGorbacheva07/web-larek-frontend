import {IProduct, IProductsModel} from "../../../src/types/index";
import {IEvents} from "../../components/base/events";


export class ProductsModel implements IProductsModel {
protected _products: IProduct[]= [];
protected _previewId: string | null = null;
protected events: IEvents;

constructor (events: IEvents){
    this.events = events;
}
//получить список товаров
getProducts(): IProduct[] | undefined {
    return this._products;
}
//сохранить массив товаров
setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit('items:change');
}
// получить выбранную карточку по id
getProductById (productId:string): IProduct | undefined {
        return this._products.find((product) => product.id === productId);
    }
// установить выбранную карточку для предварительного просмотра
setPreview (product: IProduct): void {
    this._previewId = product.id;
		this.events.emit('preview:changed', product);
        }

    // получить превью карточки

getPreview(): IProduct | null {
		if (!this._previewId) return null;
		return this.getProductById(this._previewId) || null;
}
}



