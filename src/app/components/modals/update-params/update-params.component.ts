import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-params',
  templateUrl: './update-params.component.html',
  styleUrls: ['./update-params.component.css'],
})
export class UpdateParamsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  updateParams(data: boolean): string {
    let message: string;
    //ternario
    data 
      ? message = 'parametro actualizados satisfactoriamente' 
      : message = 'El parametro no se pudo actualizar';
    return message;
  }

  ngOnInit(): void {}
}
