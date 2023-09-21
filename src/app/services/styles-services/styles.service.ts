import { Injectable } from '@angular/core';
import { styles } from './styles';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

constructor() { }

/**
   * Estilos predefinidos para diferentes elementos de la interfaz.
   * @param {typeof styles} styleName - Un objeto con estilos predefinidos exportados desde otro archivo.
   */

getStyle(styleName: string): string {
  return styles[styleName] || '';
}

}
