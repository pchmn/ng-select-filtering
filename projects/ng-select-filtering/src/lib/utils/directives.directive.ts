import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngItemTemplate]'
})
export class NgItemTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Directive({
  selector: '[ngValueTemplate]'
})
export class NgValueTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Directive({
  selector: '[ngPlaceholderSelectTemplate]'
})
export class NgPlaceholderSelectTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Directive({
  selector: '[ngPlaceholderFilterTemplate]'
})
export class NgPlaceholderFilterTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}
