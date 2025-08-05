import { ISuccess, ISuccessActions } from "../../types";
import { Component } from "../component";

export class SuccessOrder extends Component<ISuccess> {
	protected _successButton: HTMLButtonElement;
	protected _total: HTMLElement;
     protected actions: ISuccessActions;

	constructor(container: HTMLElement, actions: ISuccessActions) {
            super(container);
            this.actions = actions;

		this._successButton = this.container.querySelector('.button.order-success__close') as HTMLButtonElement | null;
		this._total = this.container.querySelector('.order-success__description') as HTMLElement | null;
		this._successButton.addEventListener('click', () => {
			this.actions.onClick();
		});
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
} 

