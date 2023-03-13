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
      ? (alertColor = 'C7AB1E')
      : (alertColor = '');

    return alertColor;
  }
  
  //funcion para obtener la de data de las aplicacione desde el api
  aplication(){
    this.http.get( environment.baseUrl +'list/application').subscribe({
      next: this.aplicacionSuccess.bind(this),
      error: this.aplicacionError.bind(this),
    });
  }

  aplicacionSuccess(respose:any){


    console.log(respose);
  }

  aplicacionError(error:any){
    console.log(error);
  }

  name(){}


}




