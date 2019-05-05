import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectFilteringComponent } from './ng-select-filtering.component';
import { KeyCode } from './utils/keycode.enum';
import { testFilteredItemsCode, testFilteredItemsLabel, testItems } from './utils/test-items';

// Host component to test some methods (ngOnChanges(), ...) and inputs
@Component({
  selector: `ng-host-component`,
  template:
    `<ng-select-filtering
      [(ngModel)]="value"
      [items]="items"
      [bindValue]="bindValue"
      [bindLabel]="bindLabel"
      [filterBy]="filterBy"
      ></ng-select-filtering>`
})
export class HostComponent {
  @ViewChild(NgSelectFilteringComponent) ngSelectFilteringComponent: NgSelectFilteringComponent;
  items: any[];
  value: any;
  bindValue = 'code';
  bindLabel = 'label';
  filterBy: string[];
}

describe('NgSelectFilteringComponent', () => {
  let hostComponent: HostComponent;
  let component: NgSelectFilteringComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, NgSelectFilteringComponent],
      imports: [FormsModule, NgbDropdownModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    component = hostComponent.ngSelectFilteringComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnChanges] should update filtered items when items change', () => {
    // Items and filtered items should be undefined at first
    spyOn(component, 'ngOnChanges').and.callThrough();
    expect(component.items).toBeUndefined();
    expect(component.filteredItems).toBeUndefined();
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Tests
    expect(component.ngOnChanges).toHaveBeenCalled();
    expect(component.filteredItems).toEqual(testItems);
  });

  it('[selectItem] should select an item', () => {
    // Set items
    hostComponent.items = testItems;
    // Open dropdown
    component.dropdown.open();
    // Select first item
    component.selectItem(testItems[0]);
    fixture.detectChanges();
    // Tests
    expect(component.dropdown.isOpen()).toBeFalsy();
    expect(component.selectedItem).toEqual({ code: '35000', label: 'Rennes' });
    expect(component.value).toEqual('35000');
    expect(component.valueToDisplay).toEqual('Rennes');
    expect(hostComponent.value).toEqual('35000');
  });

  it('[onFiltering] should filter items (on label)', fakeAsync(() => {
    // Spies
    spyOn<any>(component, 'hoverFirstItem');
    spyOn<any>(component, 'adjustDropdownMenuHeight');
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Filter
    component.onFiltering('R');
    fixture.detectChanges();
    tick();
    // Tests
    expect(component['hoverFirstItem']).toHaveBeenCalled();
    expect(component['adjustDropdownMenuHeight']).toHaveBeenCalled();
    expect(component.filteredItems).toEqual(testFilteredItemsLabel);
  }));

  it('[onFiltering] should filter items (on code)', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Filter
    component.onFiltering('3');
    // Tests
    expect(component.filteredItems).toEqual(testFilteredItemsCode);
  });

  it('[onFiltering] should filter items (with filterBy input)', () => {
    // Set items
    hostComponent.items = testItems;
    hostComponent.filterBy = ['label'];
    fixture.detectChanges();
    // Filter
    component.onFiltering('3');
    // Tests
    expect(component.filteredItems).toEqual([]);
    // Filter
    component.onFiltering('R');
    // Tests
    expect(component.filteredItems).toEqual(testFilteredItemsLabel);
  });

  it('[onOpenChange] should init dropdown menu view (on open)', fakeAsync(() => {
    // Spies
    spyOn(component.filterInputElt.nativeElement, 'focus');
    spyOn<any>(component, 'scrollIfNecessary');
    spyOn<any>(component, 'adjustDropdownMenuHeight');
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Call onOpenChange
    component.onOpenChange(true);
    fixture.detectChanges();
    tick();
    // Tests
    expect(component.filterInputElt.nativeElement.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(component.hoveredItem).toEqual(testItems[0]);
    expect(component.dropdownToggle.getNativeElement().classList).toContain('ng-select-focused');
    expect(component['adjustDropdownMenuHeight']).toHaveBeenCalled();
    expect(component['scrollIfNecessary']).toHaveBeenCalledWith(0);
  }));

  it('[onOpenChange] should reset dropdown menu view and item list (on close)', fakeAsync(() => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Filter
    component.onFiltering('R');
    expect(component.filteredItems).toEqual(testFilteredItemsLabel);
    expect(component.filterTerm).toEqual('R');
    // Call onOpenChange
    component.onOpenChange(false);
    fixture.detectChanges();
    tick();
    // Tests
    expect(component.filteredItems).toEqual(testItems);
    expect(component.filterTerm).toBeNull();
    expect(component.dropdownToggle.getNativeElement().classList).not.toContain('ng-select-focused');
  }));

  it('[hoverPreviousItem] should hover previous item (1)', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[0];
    // Hover previous item
    component['hoverPreviousItem']();
    // Tests
    expect(component.hoveredItem).toEqual(component.filteredItems[component.filteredItems.length - 1]);
  });

  it('[hoverPreviousItem] should hover previous item (2)', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[5];
    // Hover previous item
    component['hoverPreviousItem']();
    // Tests
    expect(component.hoveredItem).toEqual(component.filteredItems[4]);
  });

  it('[hoverNextItem] should hover next item (1)', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[5];
    // Hover previous item
    component['hoverNextItem']();
    // Tests
    expect(component.hoveredItem).toEqual(component.filteredItems[6]);
  });

  it('[hoverNextItem] should hover next item (2)', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[component.filteredItems.length - 1];
    // Hover previous item
    component['hoverNextItem']();
    // Tests
    expect(component.hoveredItem).toEqual(component.filteredItems[0]);
  });

  it('[hoverFirstItem] should hover first item', () => {
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[5];
    // Hover previous item
    component['hoverFirstItem']();
    // Tests
    expect(component.hoveredItem).toEqual(component.filteredItems[0]);
  });

  it('[selectHoveredItem] should select hovered item', () => {
    spyOn(component, 'selectItem');
    // Set items
    hostComponent.items = testItems;
    fixture.detectChanges();
    // Hover first item
    component.hoveredItem = component.filteredItems[5];
    // Hover previous item
    component['selectHoveredItem']();
    // Tests
    expect(component.selectItem).toHaveBeenCalledWith(component.hoveredItem);
  });

  it('[keydown:ArrowDown] should hover next item', () => {
    spyOn<any>(component, 'hoverNextItem');
    hostComponent.items = testItems;
    // Open dropdown
    component.dropdown.open();
    // Keyboard event
    component.handleKeyDown(new KeyboardEvent('document:keydown', {
      key: KeyCode.ArrowDown
    }));
    fixture.detectChanges();
    // Tests
    expect(component['hoverNextItem']).toHaveBeenCalled();
  });

  it('[keydown:ArrowUp] should hover next item', () => {
    spyOn<any>(component, 'hoverPreviousItem');
    hostComponent.items = testItems;
    // Open dropdown
    component.dropdown.open();
    // Keyboard event
    component.handleKeyDown(new KeyboardEvent('document:keydown', {
      key: KeyCode.ArrowUp
    }));
    fixture.detectChanges();
    // Tests
    expect(component['hoverPreviousItem']).toHaveBeenCalled();
  });

  it('[keydown:Enter] should hover next item', () => {
    spyOn<any>(component, 'selectHoveredItem');
    hostComponent.items = testItems;
    // Open dropdown
    component.dropdown.open();
    // Keyboard event
    component.handleKeyDown(new KeyboardEvent('document:keydown', {
      key: KeyCode.Enter
    }));
    fixture.detectChanges();
    // Tests
    expect(component['selectHoveredItem']).toHaveBeenCalled();
  });

  it('[keydown:Escape] should hover next item', () => {
    spyOn(component.dropdown, 'close');
    hostComponent.items = testItems;
    // Open dropdown
    component.dropdown.open();
    // Keyboard event
    component.handleKeyDown(new KeyboardEvent('document:keydown', {
      key: KeyCode.Escape
    }));
    fixture.detectChanges();
    // Tests
    expect(component.dropdown.close).toHaveBeenCalled();
  });
});
