# ng-select-filtering

Select with filtering component for Angular with Bootstrap style.

## Demo
TODO

## Getting started

### Prerequisites

You need Bootstrap in your project because `ng-select-filtering` is based on Boostrap css.

#### Import Bootstrap css via npm

First install Bootstrap package :

`npm install --save bootstrap`

Then add Bootstrap css in your `angular.json` file :
```json
{
  ...
  styles: [
    ...,
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
  ]
  ...
}
```

Or directly in your `style.scss` or `style.css` file :
```css
@import '~bootstrap/dist/css/bootstrap.min.css';
```

#### Or import Bootstrap css via cdn
In your `index.html` file (cf [official doc](https://getbootstrap.com/docs/4.3/getting-started/download/#bootstrapcdn)) :
```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
```

### Install `ng-select-filtering`
`npm install --save ng-select-filtering`


## Basic usage

### Import `NgSelectFilteringModule` (and `FormsModule` to use `ngModel`)
```js
import { NgSelectFilteringModule } from 'ng-select-filtering';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [NgSelectFilteringModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Use `ng-select-filtering` component

```js
import {Component} from '@angular/core';

@Component({
selector: 'app-component',
template: `
  <ng-select-filtering
    [(ngModel)]="citySelected"
    [items]="cities"
    bindValue="postCode"
    bindLabel="city">
  </ng-select-filtering>
 `
})
export class AppComponent {
  cities: any[] = [
    {postCode: '35000', city: 'Rennes'},
    {postCode: '75000', city: 'Paris'}
  ];
  citySelected: any;
}
```

## Custom templates
You can use custom templates for the value selected (which will be displayed in the select button view) or for each item view in the dropdown menu.

### Custom value template
```html
<ng-select-filtering [(ngModel)]="citySelected" [items]="cities" bindValue="postCode" bindLabel="city">
  <ng-template ngValueTemplate let-value="value">
    <span>{{ value.postCode }} - {{ value.city }}</span>
  </ng-template>
</ng-select-filtering>
```
`let-value` is the value selected.

### Custom item template
```html
<ng-select-filtering [(ngModel)]="citySelected" [items]="cities" bindValue="postCode" bindLabel="city">
  <ng-template ngItemTemplate let-item="item" let-filterTerm="filterTerm">
    <span>{{ item.city }}</span>
    <span style="float: right">{{ item.postCode }}</span>
  </ng-template>
</ng-select-filtering>
```
`let-item` corresponds to each item of the list.

`let-filterTerm` corresponds to the text entered in the filter input.
