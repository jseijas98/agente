import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicFilterService {
  constructor() {}

  filterValue: string = '';

  dynamicFilter(storageKey: string) {
    const isReload = performance.navigation.type === 1;
    if (isReload) {
      localStorage.removeItem(storageKey);
    }
    const storageFilterValue = localStorage.getItem(storageKey);
    this.filterValue = storageFilterValue
      ? storageFilterValue.trim().toLowerCase()
      : '';
  }
}
