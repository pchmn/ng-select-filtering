# ng-select-filtering

Select with filtering component for Angular using Bootstrap style.

## Getting started

### Prerequisites

You need Bootstrap in your project because `ng-select-filtering` is based on Boostrap css.

#### Import Bootstrap css via npm

First install Bootstrap package :

```
npm install --save bootstrap
```

Then add Bootstrap css in your `angular.json` file :
```json
{
  "styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
  ]
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
```
npm install --save ng-select-filtering
```


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
`let-value` is the value selected (whole object).

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

## API
### Inputs
Name | Type | Default | Description
--- | --- | --- | ---
`items` | `any[]` | `[]` | Items list.
`bindValue` | `string` | / | Property to bind for selected model. By default whole object is binded.
`bindLabel` | `string` | / | Property to bind for label displayed. By default whole object is binded.
`placeholderSelect` | `string` | `Select a value` | Placeholder displayed in select button.
`placeholderFilter` | `string` | `Enter a filter` | Placeholder displayed in filter input.
`filterBy` | `string[]` | / | Properties to use for filtering. By default filter on all object properties.
`maxWidth` | `number` | / | Max width of dropdown menu in pixels. By default same width of select button.
`maxVisibleItems` | `number` | `5` | Maximum visible items in dropdown menu.

### Outputs
Name | Event payload | Description
--- | --- | ---
`openChange` | `boolean` | Event fired when select dropdown opens (payload = `true`) or closes (payload = `false`).
`valueChange` | `any` | Event fired when value selected changes (whole object).
`filter` | `{ filterTerm: string, filteredItems: any[] }` | Event fired when filter is typed. Emit the filter term and the filtered items.

### Methods
Name | Parameters | Returned type | Description
--- | --- | --- | ---
`open` | / | `void` | Open select dropdown.
`close` | / | `void` | Close select dropdown.

## Credits
This library is greatly inspired by  [ng-select](https://github.com/ng-select/ng-select).

## License
```
The MIT License (MIT)

Copyright (c) 2019 pchmn

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
