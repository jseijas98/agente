import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PiechartService {

  private datosFuente = new BehaviorSubject<any>(null);
  datosActualizados = this.datosFuente.asObservable();

  actualizarDatos(nuevosDatos: any) {
    this.datosFuente.next(nuevosDatos);
  }

  constructor() { }
}
