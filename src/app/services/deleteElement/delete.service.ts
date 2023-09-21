import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
export interface requestBody {
  applicationId?: string | null;
  type?: string | null;
  elementId?: number | null;
  replicaIp?: string | null;
}
export enum PayloadType {
  API = 'api',
  SERVICE = 'service',
  PERSISTENCE = 'persistence',
  INTEGRATION = 'integration',
  LOADBALANCER = 'loadBalancer',
  APIVALUE = 'apiValue',
  SERVICEVALUE = 'serviceValue',
}
@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  constructor(private http: HttpClient) {}

  delete(elementId: any, type: string) {
    let body: requestBody = { type: type, elementId: elementId };
    console.log(body);
    this.http.post(environment.url.delete, body).subscribe({
      next: this.deleteSuccess.bind(this),
      error: this.deleteError.bind(this),
    });
  }

  deleteSuccess(response: any) {
    console.log('response', response);
    this.selection.clear();
  }

  deleteError(error: any) {
    this.selection.clear();
    console.log(error);
  }

  //chebox box delete element
  dataSource: any;
  selection = new SelectionModel<any>(true, []);

  /** The label for the checkbox on the passed row */
  checkboxLabel(row: any): string {
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row}`;
  }

  DeleteData(type: PayloadType) {
    const elementSelected: Array<any> = this.selection.selected;
    console.log(this.selection.selected);

    if (elementSelected.length > 0) {
      if (
        confirm(
          '¿esta seguro que desea eliminar los items seleccionados? ' +
            '               ' +
            'ADVERTENCIA: Los registros seran eliminados de forma permanente'
        )
      ) {
        switch (type) {
          case PayloadType['API']:
            elementSelected.forEach((element) => {
              this.delete(element.apiId, type);
            });
            break;
          case PayloadType['APIVALUE']:
            // Código para eventos de tipo Service
            break;
          case PayloadType['INTEGRATION']:
            // Código para eventos de tipo Persistence
            break;
          case PayloadType['LOADBALANCER']:
            elementSelected.forEach((element) => {
              this.delete(element.Id, type);
            });
            // Código para eventos de tipo Integration
            break;
          case PayloadType['PERSISTENCE']:
            // Código para eventos de tipo LoadBalancer
            break;
          case PayloadType['SERVICE']:
            elementSelected.forEach((element) => {
              this.delete(element.Id, type);
            });
            break;
          case PayloadType['SERVICEVALUE']:
            // Código para eventos de tipo ServiceValue
            break;
          default:
            console.error('caso defualt del sistema de borrado');
        }
      }
    } else {
      alert('seleciona un elemento para eliminar');
    }
  }
}
