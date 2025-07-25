# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

Описание товара (из API). Данный интерфейс используется для учёта товаров, используемых в приложении.

```
export interface IProduct {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
}
```

Покупатель. Используется для учёта данных покупателя при оформлении заказа.

```
export interface IBuyer {
	payment: 'cash' | 'online' | '';
	address: string;
	email: string;
	phone: string;
}

Заказ, отправляемый из корзины на сервер

```

export interface IOrder extends IBuyer {
total: number;
items: string[]; // массив id товаров
}

```

Ответ сервера о заказе

```

export interface IOrderResult {
id: string;
total: number;
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductsModel

Класс отвечает за хранение и логику работы с данными карточек товаров.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- products: IProduct[] - массив объектов карточек товаров.
- preview: string | null - id товара, выбранного для просмотра в модальной окне.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- getProducts(): IProduct[] | undefined- метод для получения списка товаров
- setProductList(products: IProduct[])- метод для сохранения массива товаров
- getSelectedProduct(): IProduct | undefined- метод для получения выбранной карточки
- setProduct(productId: string): void -метод для сохранения выбранной карточки

#### Класс BasketModel

Класс отвечает за хранение и логику работы корзины с карточками товаров.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- items: string[] - массив id товаров.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
-add(id: string): void-добавить товар в корзину.
-remove(id: string): void-удалить конкретный товар из корзины.
-clear(): void- очистить корзину

- getItems(): Map<string, number>- метод для того, чтобы получить список товаров
  -getTotalCount(): number- получить количество товаров в корзине
  -hasItem(id: string): boolean - узнать наличие товара
  -getTotal(): number-вывести общую стоимомть корзины.

#### Класс BuyerModel

Класс отвечает за хранение и логику работы с данными покупателя при оформлении заказа. Осуществляет валидацию.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- buyer: IBuyer-данные, введенные покупателем.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- setData(data: keyof IBuyer, value: string):void- сохранение(обновление) данных в момент заполнения данных покупателем.
- validationData(data: Record<keyof IBuyer, string>):boolean-проверка валидации полей формы при оформлении заказа.
-getBuyerData(): IOrder- получение данных заказа
- clear(): void- очистить данные заказа.

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Header

Реализует отображение шапки главной страницы.Включает в себя кнопку корзины и счётчик.

Конструктор: (container: HTMLElement, events: IEvents).
Конструктор принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- counterElement: HTMLElement – счётчик товаров в корзине
- basketButton: HTMLElement – кнопка корзины

Так же класс предоставляет мметод для взаимодействия с данными счётчика.
- set counter(value: number) - для работы счетчика корзины

#### Класс Gallery

Реализует отображение каталога с карточками товаров на главной странице.

Конструктор: (container: HTMLElement, events: IEvents). Конструктор принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- catalog: HTMLElement – каталог с карточками товаров

Так же класс предоставляет метод для взаимодействия с этими данными.
-set catalog(items: HTMLElement[]) - для отображения карточек с товарами.

#### Класс Modal

Реализует отображение модального окна.
Конструктор: (selector: string, events: IEvents). Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.
Закрывается по Esc, крестику, оверлею.

Поля класса

- content: HTMLElement
- closeButton: HTMLButtonElement
  Предоставляет методы `open` и `close` для управления отображением модального окна.
  Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
  А также использует метод set content(value: HTMLElement) для отображения содержимого модального окна.

#### Класс SuccessOrder

Реализует отображение в модальном окне контента об успешном оформлении заказа.

Конструктор: (container: HTMLElement, actions: ISuccessActions).Конструктор принимает на входе контейнер,в который будем выводить данные и параметр с возможными действиями.

Поля класса:
- successButton: HTMLButtonElement – кнопка "За новыми покупками"
- total: HTMLElement– общая сумма заказа

Методы:

- set total(value: number)- используется для установки общей стоимости заказа.

#### Класс CardProduct

Является общим классом для отображения карточек с товаром.
Включает в себя название и стоимость.
Конструктор: (container: HTMLElement, actions?: ICardActions). Конструктор принимает на входе контейнер,в который будем выводить данные и параметр с возможными действиями.
Поля класса:
- title: HTMLElement -название товара
- price: HTMLElement- цена товара

Так же класс предоставляет метод для взаимодействия с этими данными.

- set ICardProduct (cardData: ICard): void - заполняет атрибуты элементов карточки данными.

#### Класс CardGallery

Расширяет родительский класс CardProduct. Реализует отображение карточки в каталоге на главной странице.Включает в себя название, категорию,стоимость,картинку
Конструктор: (container: HTMLElement, actions?: ICardActions). Конструктор принимает на входе контейнер,в который будем выводить данные и параметр с возможными действиями.

Поля класса:
- image: HTMLImageElement - картинка товара
- category: HTMLElement - категория товара
- button: HTMLButtonElement -кнопка для тогоБ чтобы открыть карточку в предварительный просмотр.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set CardGallery(cardData: ICard): void - заполняет атрибуты элементов карточки данными.

#### Класс CardPreview

Расширяет родительский класс CardProduct.Реализует отображение карточки в модальном окне(предварительный просмотр).Включает в себя стоимость, название,подробное описание, категорию, изображение и кнопку «Купить» или «Удалить из корзины».
Конструктор: (container: HTMLElement, actions?: ICardActions). Конструктор принимает на входе контейнер,в который будем выводить данные и параметр с возможными действиями.

Поля класса:
- image: HTMLImageElement - картинка товара
- category: HTMLElement - категория товара
- description: HTMLElement - подробное описание товара
- button: HTMLButtonElement -кнопка «Купить» или «Удалить из корзины».

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set ItemGalleryData(cardData: ICard): void - заполняет атрибуты элементов карточки данными.

#### Класс CardBasket

Расширяет родительский класс CardProduct.Реализует отображение карточки в корзине.Включает в себя порядковый номер, название, стоимость, кнопку «Удалить».
Конструктор: (container: HTMLElement, actions?: ICardActions). Конструктор принимает на входе контейнер,в который будем выводить данные и параметр с возможными действиями.

Поля класса:
- itemBasket: HTMLElement -порядковый номер товара
- button: HTMLButtonElement -кнопка «Удалить».

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set CardBasket(cardData: ICard): void - заполняет атрибуты элементов карточки данными.

#### Класс Basket

Реализует отображение списка товаров в корзине, общую стоимость и кнопку «Оформить».
Конструктор: (container: HTMLElement, events: IEvents).Конструктор принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.
Поля класса:
- basketlist: HTMLElement – контейнер для товаров корзины
- total: HTMLElement – общая сумма заказа
- button: HTMLButtonElement – кнопка «Оформить» (button)
Набор методов для взаимодействия с этими данными:
-set items(items: HTMLElement[])-устанавливает список товаров
-set total- отображает общую стоимость
-disabledButton- делает кнопку неактивной,если в корзине нет товаров

#### Класс Form

Предназначен для реализации форм, содержащих поля ввода: сбор данных, валидация, блокировка кнопок.
Конструктор (container: HTMLFormElement, events: IEvents) принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.(container: HTMLFormElement, events: IEvents)
При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активности кнопки.
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов
Методы:
-inputChange(field: keyof T, value: string)- для инициации события изменений в форме

- set valid(value: boolean)-установка валидации
- set errors(list: string[])-установка ошибки валидации

#### Класс FormOrder

Расширяет родительский класс Form. Предназначен для реализации формы, содержащей поля выбор оплаты и указания адреса.
Конструктор (container: HTMLFormElement, events: IEvents) принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.
Поля класса:
- paymentButtons( HTMLButtonElement[]) – массив кнопок способов оплаты.
- addressInput( HTMLInputElement) – поле ввода адреса.
Испульзуется метод set address(value: string) для установки адреса.

#### Класс FormContacts

Расширяет родительский класс Form. Предназначен для реализации формы, содержащей поля для контактных данных(почта,телефон)
Конструктор (container: HTMLFormElement, events: IEvents) принимает на входе контейнер,в который будем выводить данные и экземпляр класса `EventEmitter` для возможности инициации событий.
Поля класса:
- emailInput: HTMLInputElement – поле для email
- phoneInput: HTMLInputElement– поле для телефона
Испульзуется метод set email(value: string) и set phone(value: string) для установки контактных данных.

### Слой коммуникации

#### Класс AppApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список  событий, которые могут генерироваться в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- items:change - изменение массива товаров каталога
- preview:change - изменение открываемого в модальном окне товара
- basket:change - изменение списка товаров корзины
- formErrors:change - изменение в списке ошибок валидации формы

_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)_

- modal:open - открытие модального окна
- modal:close - закрытие модального окна
- basket:open - открытие корзины
- card:select - выбор карточки
- order:open - открытие окна оформления заказа
- ${form}:submit - отправка формы со значениями полей
- ${form}.${field}:change - изменение поля в форме


https://github.com/AnnaGorbacheva07/web-larek-frontend
```
