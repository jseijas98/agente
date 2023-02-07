import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlowChartService {
  public zoneDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([0, 0]);

  constructor() {}

  calculateDimensions(el: HTMLElement): void {
    const { width, height } = el.getBoundingClientRect();
    console.log(width, height);
    
    this.zoneDimensions$.next([width - 5, height - 8]);
  }
}
