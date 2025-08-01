import { IGallery } from "../../types"
import { IEvents } from "../base/events"
import { Component } from "../component"

export class Gallery extends Component<IGallery> {
    protected events: IEvents;
    protected _catalog: HTMLElement | null;; // каталог с карточками товаров
    protected _container:HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._container = container;
        this._catalog = this.container.querySelector('.gallery');
       /* this._catalog = document.querySelector('.gallery');*/
        /*this.container.querySelector('.gallery');*/
            }
    // Сеттер для отображения карточек с товарами
    set catalog(cards: HTMLElement[]) {
    this.container.innerHTML = ''; // Очищаем контейнер
    cards.forEach(card => {
        this.container.appendChild(card);
    });
}
    /*set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);  }*/

    }
