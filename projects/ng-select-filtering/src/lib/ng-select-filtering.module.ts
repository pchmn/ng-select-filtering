import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectFilteringComponent } from './ng-select-filtering.component';
import { NgItemTemplateDirective, NgPlaceholderFilterTemplateDirective, NgPlaceholderSelectTemplateDirective, NgValueTemplateDirective } from './utils/directives.directive';

@NgModule({
  declarations: [
    NgSelectFilteringComponent,
    NgItemTemplateDirective,
    NgValueTemplateDirective,
    NgPlaceholderSelectTemplateDirective,
    NgPlaceholderFilterTemplateDirective
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule
  ],
  exports: [
    NgSelectFilteringComponent,
    NgItemTemplateDirective,
    NgValueTemplateDirective,
    NgPlaceholderSelectTemplateDirective,
    NgPlaceholderFilterTemplateDirective
  ]
})
export class NgSelectFilteringModule { }
