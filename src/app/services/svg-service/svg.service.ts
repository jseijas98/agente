import { Injectable } from '@angular/core';
import { icons } from './icon';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor() { }

  getIcon(name: string): string {
    return icons[name] || '';
  }
}
