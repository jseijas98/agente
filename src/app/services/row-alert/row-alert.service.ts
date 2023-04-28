import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RowAlertService {
  constructor(public http:HttpClient) {}

  rowAlert(Halert: any, Lalert: any): string {
    let alertColor: string;

    Halert == true
      ? (alertColor = '#C71E35')
      : Lalert == true
      ? (alertColor = '#FFF200')
      : (alertColor = '');




    return alertColor;
  }

}




