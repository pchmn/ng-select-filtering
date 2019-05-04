import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectFilteringModule } from 'projects/ng-select-filtering/src/lib/ng-select-filtering.module';
import { ExamplesComponent } from './examples/examples.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ExamplesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectFilteringModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
