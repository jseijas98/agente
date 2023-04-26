import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  constructor(private http: HttpClient) {}

  delete(elementId: any, type: string) {
    this.http
      .delete(`${environment.baseUrl}deleteElement/${type}/${elementId}`)
      .subscribe({
        next: this.deleteSuccess.bind(this),
        error: this.deleteError.bind(this),
      });
  }

  deleteSuccess(response: any) {
    console.log('response', response);
  }

  deleteError(error: any) {
    console.log(error);
  }

  //chebox box delete element
  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const elementSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return elementSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((r: any) => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.UserId + 1
    }`;
  }

  DeleteData(type: string) {
    const elementSelected: Array<any> = this.selection.selected;
    console.log(elementSelected[0]);

    if (elementSelected.length > 0) {
      if (
        confirm(
          '¿esta seguro que desea eliminar los items seleccionados? ' +
            '               ' +
            'ADVERTENCIA: Los registros seran eliminados de forma permanente'
        )
      ) {
        elementSelected.forEach((element) => {
          this.delete(element.Id, type);
        });
      }
    } else {
      alert('seleciona un elemento para eliminar');
    }
  }
}
