import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BodyRequest,
  BodyResponse,
} from 'src/app/modules/interfaces/model.add-new-element';
import { environment } from 'src/environments/environment';
import { PayloadType } from '../deleteElement/delete.service';

@Injectable({
  providedIn: 'root',
})
export class ElemnetQueryServiceService {
  constructor(private http: HttpClient) {}

  public postRequest(body: BodyRequest): Observable<BodyResponse> {
    const url = environment.url.element;
    return this.http.post<BodyResponse>(url, body);
  }

  goRegistry(type: PayloadType, idNUM: number): string {

    let id = idNUM.toString();

    switch (type) {
      case PayloadType.API:
        return `apis-registry/${id}`;
      case PayloadType.SERVICE:
        return `services-registry/${id}`;
      case PayloadType.PERSISTENCE:
        return `persistence-registry/${id}`;
      case PayloadType.INTEGRATION:
        return `pic-registry/${id}`;
      case PayloadType.LOADBALANCER:
        return `loadBalancer-registry/${id}`;
      case PayloadType.APIVALUE:
        return '6';
      case PayloadType.SERVICEVALUE:
        return '7';
    }
  }

  goReplica(type: PayloadType, idNUM: number): string {

    let id = idNUM.toString();

    switch (type) {
      case PayloadType.API:
        return `apis-registry/${id}`;
      case PayloadType.SERVICE:
        return `services-replicas/${id}`;
      default:
        return '';
    }
  }
}
