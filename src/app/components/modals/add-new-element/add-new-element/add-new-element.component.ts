import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AddNewElementFormComponent } from 'src/app/components/add-new-element-form/add-new-element-form/add-new-element-form.component';
import { __values } from 'tslib';

@Component({
  selector: 'app-add-new-element',
  templateUrl: './add-new-element.component.html',
  styleUrls: ['./add-new-element.component.css'],
})
export class AddNewElementComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private activateRouter: ActivatedRoute,
    private snakbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  @Output() newItemEvent = new EventEmitter<string>();

  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewElementFormComponent, {
      disableClose: true,
      data: this.getActiveRouter(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('hola', result);
      console.log('dialog:', result?._value?.status);
      this.addNewItem(result?._value?.status);

      this.snakbar.open(
        result?._value?.status !== 1000
          ? 'ERROR: al agregar nuevo elemento'
          : result?._value?.message,
        'ACEPTAR'
      );
    });
  }

  getActiveRouter(): any {
    let id: any;
    this.activateRouter.params.subscribe((params) => {
      id = params['id'];
    });
    console.log('id', id);
    return id;
  }
}
