
export class Utils {
  static filter(items: any[], filter: string, filterBy: string[]): any[] {
    const filterLowerCase = filter.toLowerCase();
    return items.filter(item => this.objectContains(item, filterLowerCase, filterBy));
  }

  private static objectContains(object: any, filter: string, filterBy: string[]): boolean {
    // If no filter specified, we will check on all properties of the object
    if (!filterBy) {
      filterBy = Object.keys(object);
    }
    // If no property, check on object directly
    if (filterBy.length === 0) {
      return object.toString().toLowerCase().includes(filter);
    }
    // Check on properties calculated previously
    for (const key of filterBy) {
      if (object[key].toString().toLowerCase().includes(filter)) {
        return true;
      }
    }
    return false;
  }

  static getPaddingTop(el: Element): number {
    return +window.getComputedStyle(el, null).paddingTop.replace('px', '');
  }

  static getPaddingBottom(el: Element): number {
    return +window.getComputedStyle(el, null).paddingBottom.replace('px', '');
  }
}
