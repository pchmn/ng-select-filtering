import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractValueAccessor<T> implements ControlValueAccessor {

  innerValue: T;
  @Input() disabled = false;
  propagateChange = (_: any) => { };
  propagateTouch = (_: any) => { };

  constructor() { }

  get value() {
    return this.innerValue;
  }

  set value(value: T) {
    this.innerValue = value;
    this.propagateChange(value);
  }

  writeValue(value: T): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
