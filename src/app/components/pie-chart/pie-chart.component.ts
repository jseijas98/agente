import { Component, Input, OnInit, inject } from '@angular/core';
import { StylesService } from 'src/app/services/styles-services/styles.service';

import {
  ColorHex,
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
  view: [number, number] = [200, 200];
  styles = inject(StylesService);
  animation = true; //
  value: number = 50;
  previousValue: number = 70;
  units: string = 'counts';
  private piechartService = inject(PiechartService);
  data: editValue[] = [];
  valueString: editValue[] = [];



  stringValues() {
  }


  processData(data: any, type: string) {
    if (type === PayloadType.APIVALUE) {
      const values: Value[] = data as Value[];

      const filteredValues = values.filter(
        (value) => value.typeOfValue === 'NUMBER'
      );
      const editValue = this.dataApiValue(filteredValues);
      this.data = editValue;

      const valuesString = values.filter(
        (value) => value.typeOfValue === 'STRING'
      );
      const editString = this.dataApiValue(valuesString);
      this.valueString = editString;
      console.log('Data como Value:', values);

    } else if (type === PayloadType.SERVICEVALUE) {
      const serviceData: Metric[] = data as Metric[];

      const valuesString = serviceData.filter(
        (value) => value.typeOfValue === 'STRING'
      );

      const editString = this.dataServiceValue(valuesString);
      this.valueString = editString;
      console.log('Data como STRING:', editString);


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

  sub(data: editValue): string {
    const comparator = data.comparator;
    const name = data.normalValueState
    const mayor = 'MENOR';
    const menor = 'MAYOR';

    if (comparator === menor) {
      return `el valor debe ser mayor a ${name}`
    }
    if (comparator === mayor) {
      return `el valor debe ser menor a ${name}`
    }
    return `hola`
  }

  evaluarMetric(dat: editValue): any {
    const comparator = dat.comparator;
    const mayor = 'MENOR';
    const menor = 'MAYOR';
    let color: string;

    if (comparator === menor) {
      color = this.comparadorMayor(dat);
      return { 'background-color': color };
    }

    if (comparator === mayor) {
      color = this.comparadorMenor(dat);
      return { 'background-color': color };
    }
    return { 'background-color': ColorHex.DEFAULT };
  }

  stringMetric(dat: editValue): any {

    const alarm = dat.stateAlarm;
    let colorSets;

    alarm? colorSets = ColorHex.ROJO: colorSets = ColorHex.VERDE

    return { 'background-color': colorSets };

  }




  comparadorMayor(dat: editValue): string {
    const valorActual = parseFloat(dat.actualStateValue || '0');
    const warningValueState = parseFloat(dat.warningValueState || '0');
    const criticValueState = parseFloat(dat.criticValueState || '0');
    const normalValueState = parseFloat(dat.normalValueState || '0');

    // manejar valores nulos o NaN como 0:
    if (isNaN(valorActual) || isNaN(warningValueState) || isNaN(criticValueState) || isNaN(normalValueState)) {
      return ColorHex.DEFAULT; // Color predeterminado para valores no válidos
    }

    // comparación y devuelve el color correspondiente
    if (valorActual < warningValueState) {
      return ColorHex.AMARILLO;
    } else if (valorActual < criticValueState) {
      return ColorHex.ROJO;
    } else if (valorActual >= valorActual) {
      return ColorHex.VERDE;
    } else {
      return ColorHex.DEFAULT; // Color predeterminado
    }
  }

  comparadorMenor(dat: editValue): string {
    const valorActual = parseFloat(dat.actualStateValue || '0');
    const warningValueState = parseFloat(dat.warningValueState || '0');
    const criticValueState = parseFloat(dat.criticValueState || '0');
    const normalValueState = parseFloat(dat.normalValueState || '0');

    if (isNaN(valorActual) || isNaN(warningValueState) || isNaN(criticValueState) || isNaN(normalValueState)) {
      return ColorHex.DEFAULT;
    }

    if (valorActual > warningValueState) {
      return ColorHex.AMARILLO;
    } else if (valorActual > criticValueState) {
      return ColorHex.ROJO;
    } else if (valorActual <= criticValueState) {
      return ColorHex.VERDE;
    } else {
      return ColorHex.DEFAULT;
    }
  }



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
      stateAlarm: value.stateAlarm
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
      stateAlarm: value.stateAlarm
    }));
  }


  constructor(
  ) { }

  ngOnInit(): void {
    this.piechartService.datosActualizados.subscribe((datos) => {
      console.log("dato to process",datos);
      
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
}
