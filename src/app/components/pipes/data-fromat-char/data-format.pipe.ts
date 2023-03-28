import { formatDate, JsonPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformarDatos',
})
export class DataFormatPipe implements PipeTransform {
  transform(value: any): any {
    console.log('valor', value);

    const nuevoObjeto = {
      valor: value.value,
      fecha: value.name,
      nombre: value.series,
    };

    console.log(nuevoObjeto);

    return nuevoObjeto;
  }
}
