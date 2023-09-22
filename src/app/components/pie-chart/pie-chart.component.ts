import { Component, OnInit, inject } from '@angular/core';
import { single } from './interfaces';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { StylesService } from 'src/app/services/styles-services/styles.service';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  view:[number, number] = [700, 400];

  styles = inject(StylesService)

  animation = false; //

  single: single[] = [
    {
      alarm: true,
      valor: 2000,
      values: [
        {
          name: 'jdbc.connections.max',
          value: 1500,
        },
      ],
    },
    {
      alarm: false,
      valor: 500,
      values: [
        {
          name: 'jdbc.connections.active',
          value: 100,
        },
      ],
    },
    {
      alarm: true,
      valor: 2000,
      values: [
        {
          name: 'jdbc.connections.max',
          value: 1500,
        },
      ],
    },
    {
      alarm: false,
      valor: 500,
      values: [
        {
          name: 'jdbc.connections.active',
          value: 100,
        },
      ],
    },
    {
      alarm: true,
      valor: 2000,
      values: [
        {
          name: 'jdbc.connections.max',
          value: 1500,
        },
      ],
    },
    {
      alarm: false,
      valor: 500,
      values: [
        {
          name: 'jdbc.connections.active',
          value: 100,
        },
      ],
    }
  ];


  colorScheme = {
    domain: ['#FF0000'],
  };


  changeColor(alarm: boolean): Color {
    const color = alarm ? '#FF0000' : '#5AA454';

    return {
      name: '', //
      selectable: false,
      group: ScaleType.Linear,
      domain: [color],
    };
  }
  

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

    

      const BUTTON_OK = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
  </svg>`;

  matIconRegistry.addSvgIconLiteral('BUTTON_OK', domSanitizer.bypassSecurityTrustHtml(BUTTON_OK));

  const BUTTOM_BAD = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
  </svg>`;
  matIconRegistry.addSvgIconLiteral('BUTTOM_BAD', domSanitizer.bypassSecurityTrustHtml(BUTTOM_BAD));


    this.single.forEach((algo) => console.log(algo));
  }


    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = true;
    legendPosition: string = 'right';

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  stylesColor(alarm: boolean):string{
     const color = alarm ? this.styles.getStyle('BUTTOM_BAD') : this.styles.getStyle('BUTTON_OK');
     return color

  }




}
