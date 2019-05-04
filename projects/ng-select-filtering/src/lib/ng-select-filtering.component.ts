import { Component, ContentChild, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
export class NgSelectFilteringComponent extends AbstractValueAccessor<any> implements OnInit {

  // Inputs
  @Input() items: any[];
  @Input() bindValue: string;
  @Input() bindLabel: string;
  @Input() placeholderSelect: string;
  @Input() placeholderFilter: string;
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

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    // Clone of items
    this.filteredItems = [...this.items];
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

  @HostListener('keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if (KeyCode[$event.which]) {
      switch ($event.which) {
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
        case KeyCode.ArrowLeft:
          this.hoverFirstItem();
          break;
        case KeyCode.ArrowRight:
          this.hoverLastItem();
          break;
        case KeyCode.Enter:
          this.selectHoveredItem();
          break;
        case KeyCode.Esc:
          this.dropdown.close();
          $event.preventDefault();
          $event.stopPropagation();
          break;
      }
    }
  }

  private hoverPreviousItem() {
    const indexOfHoveredItem = this.filteredItems.indexOf(this.hoveredItem);
    if (indexOfHoveredItem > -1) {
      if (indexOfHoveredItem === 0) {
        // If hovered item was the first one of the list, select the last one
        this.hoveredItem = this.filteredItems[this.filteredItems.length - 1];
      } else {
        // Else just hover the previous one
        this.hoveredItem = this.filteredItems[indexOfHoveredItem - 1];
      }
    }
  }

  private hoverNextItem() {
    const indexOfHoveredItem = this.filteredItems.indexOf(this.hoveredItem);
    if (indexOfHoveredItem > -1) {
      if (indexOfHoveredItem === this.filteredItems.length - 1) {
        // If hovered item was the last one of the list, select the first one
        this.hoveredItem = this.filteredItems[0];
      } else {
        // Else just hover the next one
        this.hoveredItem = this.filteredItems[indexOfHoveredItem + 1];
      }
    }
  }

  private hoverFirstItem() {
    this.hoveredItem = this.filteredItems[0];
    this.itemsDivElt.nativeElement.scrollTo(0, 0);
  }

  private hoverLastItem() {
    this.hoveredItem = this.filteredItems[this.filteredItems.length - 1];
    this.itemsDivElt.nativeElement.scrollTo(0, this.itemsDivHeight);
  }

  private selectHoveredItem() {
    if (this.hoveredItem) {
      this.selectItem(this.hoveredItem);
    }
  }
}
