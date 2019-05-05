import { Component, ContentChild, ElementRef, forwardRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { AbstractValueAccessor } from './utils/abstract-value-accessor';
import { NgItemTemplateDirective, NgValueTemplateDirective } from './utils/directives.directive';
import { KeyCode } from './utils/keycode.enum';
import { Utils } from './utils/utils';

@Component({
  selector: 'ng-select-filtering',
  templateUrl: './ng-select-filtering.component.html',
  styleUrls: ['./ng-select-filtering.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectFilteringComponent),
    multi: true
  }]
})
export class NgSelectFilteringComponent extends AbstractValueAccessor<any> implements OnChanges {

  // Inputs
  @Input() items: any[] = [];
  @Input() bindValue: string;
  @Input() bindLabel: string;
  @Input() placeholderSelect = 'Select a value';
  @Input() placeholderFilter = 'Enter a filter';
  @Input() filterBy: string[];
  @Input() maxWidth: number;
  @Input() maxVisibleItems = 5;
  // Items
  filteredItems: any[];
  filterTerm: string;
  // Item selected
  valueToDisplay: string;
  selectedItem: any;
  hoveredItem: any;
  // View children
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild(NgbDropdownToggle) dropdownToggle: NgbDropdownToggle;
  @ViewChild(NgbDropdownMenu) dropdownMenu: NgbDropdownMenu;
  @ViewChild('dropdownMenu') dropdownMenuElt: ElementRef;
  @ViewChild('filterInput') filterInputElt: ElementRef;
  @ViewChild('itemsDiv') itemsDivElt: ElementRef;
  // Custom templates
  @ContentChild(NgValueTemplateDirective, { read: TemplateRef }) valueTemplate: TemplateRef<any>;
  @ContentChild(NgItemTemplateDirective, { read: TemplateRef }) itemTemplate: TemplateRef<any>;
  // Variables for style
  dropdownMenuWidth: number;
  itemsDivHeight: number;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if (KeyCode[$event.key] && this.dropdown.isOpen()) {
      switch ($event.key) {
        case KeyCode.ArrowDown:
          this.hoverNextItem();
          // Prevent cursor from moving
          $event.preventDefault();
          break;
        case KeyCode.ArrowUp:
          this.hoverPreviousItem();
          // Prevent cursor from moving
          $event.preventDefault();
          break;
        case KeyCode.Enter:
          this.selectHoveredItem();
          break;
        case KeyCode.Escape:
          this.dropdown.close();
          $event.preventDefault();
          $event.stopPropagation();
          break;
      }
    }
  }

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Each time items change, update filteredItems
    if (changes.items && this.items) {
      // Clone of items
      this.filteredItems = [...this.items];
    }
  }

  selectItem(item: any) {
    // Close the dropdown
    this.dropdown.close();

    this.selectedItem = item;
    // Bind value
    if (this.bindValue && item.hasOwnProperty(this.bindValue)) {
      this.value = item[this.bindValue];
    } else {
      this.value = item;
    }
    // Bind label
    if (this.bindLabel && item.hasOwnProperty(this.bindLabel)) {
      this.valueToDisplay = item[this.bindLabel];
    } else {
      this.valueToDisplay = item;
    }
  }

  hoverItem(item: any) {
    this.hoveredItem = item;
  }

  onFiltering(filter: string) {
    this.filterTerm = filter;
    this.filteredItems = Utils.filter(this.items, filter, this.filterBy);
    // Hover first item when filtering
    this.hoverFirstItem();
    // Adjust height
    setTimeout(() => this.adjustDropdownMenuHeight());
  }

  onOpenChange(isOpen: boolean) {
    // Use setTimeout so filterInputElt and itemsDivElt won't be null
    setTimeout(() => {
      if (isOpen && this.filterInputElt && this.itemsDivElt) {
        // If dropdown is open, autofocus on filter input
        this.filterInputElt.nativeElement.focus({ preventScroll: true });
        // Hover first element if no item selected
        if (!this.selectedItem) {
          this.hoveredItem = this.filteredItems[0];
        } else {
          this.hoveredItem = this.selectedItem;
        }
        // Add class focused
        this.renderer.addClass(this.dropdownToggle.getNativeElement(), 'ng-select-focused');
        // Dropdown menu width
        // So the width stays fix when filtering
        this.dropdownMenuWidth = this.dropdownMenuElt.nativeElement.clientWidth;
        // Items div height
        // Useful when scrolling with keyboard
        this.itemsDivHeight = this.itemsDivElt.nativeElement.clientHeight;
        // Visible items
        this.adjustDropdownMenuHeight();
        this.scrollIfNecessary(this.filteredItems.indexOf(this.hoveredItem));
      } else if (!isOpen) {
        // If dropdown is closed, reset filtering
        this.filteredItems = [...this.items];
        this.filterTerm = null;
        // Remove class focused
        this.renderer.removeClass(this.dropdownToggle.getNativeElement(), 'ng-select-focused');
      }
    });
  }

  private adjustDropdownMenuHeight() {
    const paddingTop = Utils.getPaddingTop(this.itemsDivElt.nativeElement);
    const paddingBottom = Utils.getPaddingBottom(this.itemsDivElt.nativeElement);
    const menuItems = this.dropdownMenu.menuItems.toArray();
    let itemsDivHeight = this.maxVisibleItems > menuItems.length ? paddingTop + paddingBottom : paddingTop;

    for (let i = 0; i < this.maxVisibleItems && i < menuItems.length; i++) {
      itemsDivHeight += menuItems[i].elementRef.nativeElement.clientHeight;
    }
    this.itemsDivElt.nativeElement.style.maxHeight = `${itemsDivHeight}px`;
    // Save items div height for scrolling
    this.itemsDivHeight = this.itemsDivElt.nativeElement.clientHeight;

    // Scroll to top of items
    this.itemsDivElt.nativeElement.scrollTop = 1; // Workaround to show scroll bar on osx
    this.itemsDivElt.nativeElement.scrollTop = 0;
  }

  private hoverPreviousItem() {
    const indexOfHoveredItem = this.filteredItems.indexOf(this.hoveredItem);
    if (indexOfHoveredItem > -1) {
      let previousIndex: number;
      if (indexOfHoveredItem === 0) {
        // If hovered item was the first one of the list, select the last one
        previousIndex = this.filteredItems.length - 1;
      } else {
        // Else just hover the previous one
        previousIndex = indexOfHoveredItem - 1;
      }
      this.hoveredItem = this.filteredItems[previousIndex];
      this.scrollIfNecessary(previousIndex);
    }
  }

  private hoverNextItem() {
    const indexOfHoveredItem = this.filteredItems.indexOf(this.hoveredItem);
    if (indexOfHoveredItem > -1) {
      let nextIndex: number;
      if (indexOfHoveredItem === this.filteredItems.length - 1) {
        // If hovered item was the last one of the list, select the first one
        nextIndex = 0;
      } else {
        // Else just hover the next one
        nextIndex = indexOfHoveredItem + 1;
      }
      this.hoveredItem = this.filteredItems[nextIndex];
      this.scrollIfNecessary(nextIndex);
    }
  }

  private hoverFirstItem() {
    this.hoveredItem = this.filteredItems[0];
    this.itemsDivElt.nativeElement.scrollTo(0, 0);
  }

  private selectHoveredItem() {
    if (this.hoveredItem) {
      this.selectItem(this.hoveredItem);
    }
  }

  private scrollIfNecessary(indexToHover: number) {
    // Get positions
    const itemHoveredElt = this.dropdownMenu.menuItems.toArray()[indexToHover].elementRef.nativeElement;
    const itemsDivPositionTop = this.itemsDivElt.nativeElement.scrollTop;
    const itemHoveredPositionTop = itemHoveredElt.offsetTop - this.itemsDivElt.nativeElement.offsetTop;
    const itemsDivPositionBottom = this.itemsDivElt.nativeElement.clientHeight + itemsDivPositionTop;
    const itemHoveredPositionBottom = itemHoveredPositionTop + itemHoveredElt.clientHeight;

    if (itemHoveredPositionBottom > itemsDivPositionBottom) {
      // Item hovered is not visible and we have to scroll down to the bottom of the item (minus height of the container to scroll)
      this.itemsDivElt.nativeElement.scrollTo(0, itemHoveredPositionBottom - this.itemsDivElt.nativeElement.clientHeight);
    } else if (itemHoveredPositionTop < itemsDivPositionTop) {
      // Item hovered is not visible and we have to scroll to the top of the item
      this.itemsDivElt.nativeElement.scrollTo(0, itemHoveredPositionTop);
    }
  }
}
