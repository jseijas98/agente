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

  //TODO: algo con la respuesta

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
    Validators.min(1),
    Validators.pattern(this.numberRegEx),
  ]);

  Highctrl = new FormControl('', [
    Validators.min(1),
    Validators.max(100),
    Validators.pattern(this.numberRegEx),
  ]);

  Lowctrl = new FormControl('', [
    Validators.min(1),
    Validators.max(100),
    Validators.pattern(this.numberRegEx),
  ]);

  updateTeParams(interval: any, low: any, high: any) {
    let dataUpdate = {
      type: this.data.type,
      idNumber: this.data.item_id,
      testInterv: parseInt(interval)
        ? parseInt(interval)
        : parseInt(interval)
        ? isNaN(parseInt(interval))
        : 0,
      lowTrigger: parseInt(low)
        ? parseInt(low)
        : parseInt(low)
        ? isNaN(parseInt(low))
        : 0,
      highTrigger: parseInt(high)
        ? parseInt(high)
        : parseInt(high)
        ? isNaN(parseInt(high))
        : 0,
    };
    this.changeParameters(dataUpdate);
    console.log('data send', dataUpdate);
  }

  

  space(data: any): boolean {
    data == undefined ? false : true;
    return data;
  }
}
