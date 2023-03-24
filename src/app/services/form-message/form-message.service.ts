import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormMessageService {

  getErrorMessage_testInterval(form: any) {
    if (form.hasError('required')) {
      return 'este campos es requerido';
    }
    return form.hasError('pattern')
      ? 'este campo es de tipo de numerico'
      : form.hasError('min')
      ? 'etse campo debe ser mayor a 100 ms'
      : form.hasError('max')
      ? 'etse campo debe ser menor a 60000ms'
      : '';
  }
  
  getErrorMessage_required(form: FormGroup) {
    return form.invalid ? 'este campo es requerido' : '';
  }
  
  buttontoggle(algo: any) {
    return algo == undefined ? true : false;
  }
}


