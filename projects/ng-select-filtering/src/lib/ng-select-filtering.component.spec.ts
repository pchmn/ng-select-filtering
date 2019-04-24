import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectFilteringComponent } from './ng-select-filtering.component';

describe('NgSelectFilteringComponent', () => {
  let component: NgSelectFilteringComponent;
  let fixture: ComponentFixture<NgSelectFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSelectFilteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
