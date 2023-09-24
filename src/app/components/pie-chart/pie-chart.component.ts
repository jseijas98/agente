import { Component, Input, OnInit, inject } from '@angular/core';
import { single } from './interfaces';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { StylesService } from 'src/app/services/styles-services/styles.service';
import { MatIconRegistry } from '@angular/material/icon';
import {
  Metric,
  Value,
  editValue,
} from 'src/app/modules/interfaces/model.services/model.services-list';
import { PayloadType } from 'src/app/services/deleteElement/delete.service';
import { PiechartService } from 'src/app/services/piechar/piechart.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() dataIn: any;
  @Input() type: string;
  view: [number, number] = [150, 150];
  styles = inject(StylesService);
  animation = false; //
  value: number = 50;
  previousValue: number = 70;
  units: string = 'counts';
  private piechartService = inject(PiechartService);
  defaultColo:string = '#B5B2B2';

  processData(data: any, type: string) {
    if (type === PayloadType.APIVALUE) {
      const values: Value[] = data as Value[];
      const filteredValues = values.filter(
        (value) => value.typeOfValue === 'NUMBER'
      );
      const editValue = this.dataApiValue(filteredValues);
      console.log('Data como Value:', values);
      this.data = editValue;
    } else if (type === PayloadType.SERVICEVALUE) {
      const serviceData: Metric[] = data as Metric[];
      const filteredValues = serviceData.filter(
        (value) => value.typeOfValue === 'NUMBER'
      );
      const editValues = this.dataServiceValue(filteredValues);
      console.log('Data como Metric:', editValues);
      this.data = editValues;
    } else {
      console.log('Data no es un objeto válido:', data);
    }
  }

  evaluarMetric(dat: editValue): Color {
    const comparator = dat.comparator;
    const mayor = 'MENOR';
    const menor = 'MEYOR';
    let color: string;

    if (comparator === menor) {
      color = this.comparadorMenor(dat);
      return {
        name: '', //
        selectable: false,
        group: ScaleType.Linear,
        domain: [color],
      };
    }

    if (comparator === mayor) {
      color = this.comparadorMenor(dat);
      return {
        name: '', //
        selectable: false,
        group: ScaleType.Linear,
        domain: [color],
      };
    }

    return {
      name: '', //
      selectable: false,
      group: ScaleType.Linear,
      domain: ['5AA454'],
    };
  }

  comparadorMenor(dat: editValue): string {
    const valorActual = parseFloat(dat.actualStateValue || '0');
    const warningValueState = parseFloat(dat.warningValueState || '0');
    const criticValueState = parseFloat(dat.criticValueState || '0');
    const normalValueState = parseFloat(dat.normalValueState || '0');

    // Realizar aquí la lógica de comparación con los valores

    // Por ejemplo, si quieres manejar valores nulos o NaN como 0:
    if (isNaN(valorActual) || isNaN(warningValueState) || isNaN(criticValueState) || isNaN(normalValueState)) {
      return 'COLOR_POR_DEFECTO'; // Color predeterminado para valores no válidos
    }

    // Luego, realiza tu lógica de comparación y devuelve el color correspondiente
    if (valorActual < warningValueState) {
      return 'COLOR_PARA_VALOR_MENOR_QUE_WARNING';
    } else if (valorActual < criticValueState) {
      return 'COLOR_PARA_VALOR_MENOR_QUE_CRITICO';
    } else {
      return 'COLOR_POR_DEFECTO'; // Color predeterminado para otros casos
    }
  }


  comparadorMayor(dat: editValue): string {
    const valorActual = parseFloat(dat.actualStateValue || '0');
    const warningValueState = parseFloat(dat.warningValueState || '0');
    const criticValueState = parseFloat(dat.criticValueState || '0');
    const normalValueState = parseFloat(dat.normalValueState || '0');

    // Realizar aquí la lógica de comparación con los valores

    // Por ejemplo, si quieres manejar valores nulos o NaN como 0:
    if (isNaN(valorActual) || isNaN(warningValueState) || isNaN(criticValueState) || isNaN(normalValueState)) {
      return 'COLOR_POR_DEFECTO'; // Color predeterminado para valores no válidos
    }

    // Luego, realiza tu lógica de comparación y devuelve el color correspondiente
    if (valorActual > warningValueState) {
      return 'COLOR_PARA_VALOR_MAYOR_QUE_WARNING';
    } else if (valorActual > criticValueState) {
      return 'COLOR_PARA_VALOR_MAYOR_QUE_CRITICO';
    } else {
      return 'COLOR_POR_DEFECTO'; // Color predeterminado para otros casos
    }
  }

  data: editValue[] = [];

  dataServiceValue(values: Metric[]): editValue[] {
    return values.map((value) => ({
      type: PayloadType.SERVICEVALUE,
      elementId: value.valueId,
      valuePath: value.valuePath,
      value: value.value,
      typeOfValue: value.typeOfValue,
      descriptionOfValue: value.descriptionOfValue,
      normalValueState: value.normalValueState,
      warningValueState: value.warningValueState || '',
      criticValueState: value.criticValueState || '',
      comparator: value.comparator || '',
      actualStateValue: value.actualStateValue,
    }));
  }

  dataApiValue(values: Value[]): editValue[] {
    return values.map((value) => ({
      type: PayloadType.APIVALUE,
      elementId: value.valueId,
      valuePath: value.valuePath,
      value: value.value,
      typeOfValue: value.typeOfValue,
      descriptionOfValue: value.descriptionOfValue,
      normalValueState: value.normalValueState,
      warningValueState: value.warningValueState || '',
      criticValueState: value.criticValueState || '',
      comparator: value.comparator || '',
      actualStateValue: value.actualStateValue,
    }));
  }

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
    private domSanitizer: DomSanitizer
  ) {
    const BUTTON_OK = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
  </svg>`;

    matIconRegistry.addSvgIconLiteral(
      'BUTTON_OK',
      domSanitizer.bypassSecurityTrustHtml(BUTTON_OK)
    );

    const BUTTOM_BAD = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
  </svg>`;
    matIconRegistry.addSvgIconLiteral(
      'BUTTOM_BAD',
      domSanitizer.bypassSecurityTrustHtml(BUTTOM_BAD)
    );
  }

  ngOnInit(): void {
    this.piechartService.datosActualizados.subscribe((datos) => {
      this.processData(datos, this.type);
    });
  }

  stringToNumberOrZero(input: string | undefined): number {
    if (input === undefined || input === null) {
      return 0;
    }
    const parsedNumber = parseFloat(input);
    return isNaN(parsedNumber) ? 0 : parsedNumber;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  stylesColor(alarm: boolean): string {
    const color = alarm
      ? this.styles.getStyle('BUTTOM_BAD')
      : this.styles.getStyle('BUTTON_OK');
    return color;
  }
}
