import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private clipboard: Clipboard, private _snackBar: MatSnackBar) {}

  clickboard:string="copiar en portapales"

  copyHeroName() {
    this.clipboard.copy(this.data);
    this.openSnackBar('meta data copiada','aceptar',1000)
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  


    openSnackBar(message: string, action: string, duration: number) {
      this._snackBar.open(message, action, {duration:duration,horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,panelClass:['text-aling:center;']});
    }

  ngOnInit(): void {}
}

