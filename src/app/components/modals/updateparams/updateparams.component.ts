import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { _isNumberValue } from '@angular/cdk/coercion';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-updateparams',
  templateUrl: './updateparams.component.html',
  styleUrls: ['./updateparams.component.css'],
})
export class UpdateparamsComponent implements OnInit {
  snakbar: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  public data$: BehaviorSubject<any> = new BehaviorSubject(null);

  ngOnInit(): void {

  }

  changeParameters(dataupdate: any) {
    this.http.post<any>(environment.baseUrl + 'params', dataupdate).subscribe({
      next: this.updateResponse.bind(this),
      error: this.updateError.bind(this),
    });
  }


  updateResponse(response: any) {
    console.log('update response', response);

    this.data$.next(response);
  }

  updateError(error: any) {
    this.data$.next(error);
    console.log(error);
  }


  numberRegEx = /\-?\d*\.?\d{1,2}/;

  intervalCtrl = new FormControl('', [
    Validators.min(100),
    Validators.pattern(this.numberRegEx),
    Validators.minLength(3)
  ]);

  Highctrl = new FormControl('', [
    Validators.min(1),
    Validators.max(100),
    Validators.pattern(this.numberRegEx),
    Validators.minLength(1)
  ]);

  Lowctrl = new FormControl('', [
    Validators.min(1),
    Validators.max(100),
    Validators.pattern(this.numberRegEx),
    Validators.minLength(1)
  ]);

  updateTeParams(interval: any, low: any, high: any) {
    let dataUpdate = {
      type: this.data.type,
      idNumber: this.data.item_id,
      testInterv: this._validateData(interval),
      warningTrigger: this._validateData(low),
      criticalTrigger: this._validateData(high),
    };
    this.changeParameters(dataUpdate);
    console.log('data send', dataUpdate);
  }

  _validateData(value: string): any {
    let data;
   try {
     data = value != null && value != "" ? parseInt(value): null;
   } catch (error) {
    console.log(error, `Hubo un erro en la validacion de ${value}`);
   }
    return data;
  }



  space(data: any): boolean {
    data == undefined ? false : true;
    return data;
  }

  getErrorMessage_testInterval(form:any){
    if(form.hasError('min')) {

      return 'el valor debe ser mayor a 100ms';
    }
    return form.hasError('pattern')? 'este campo es de tipo de numerico':'';
  }
}
