import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddNewElementFormComponent } from 'src/app/components/add-new-element-form/add-new-element-form/add-new-element-form.component';

@Component({
  selector: 'app-add-new-element',
  templateUrl: './add-new-element.component.html',
  styleUrls: ['./add-new-element.component.css'],
})
export class AddNewElementComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.getActiveRouter()
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewElementFormComponent, {
      data: this.getActiveRouter(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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
