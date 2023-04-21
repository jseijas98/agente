import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import {
  async,
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  timeout,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Componente,
  ComponentList,
  DataAplication,
} from '../../modules/interfaces/model.componetList/componentList';
@Injectable({
  providedIn: 'root',
})
export class FlowChartService {
  public data$: BehaviorSubject<any> = new BehaviorSubject(null);
  update$: Subject<any> = new Subject();

  constructor(private http: HttpClient) {}

  // -------------------esquema de colores----------------------------

  colorScheme(data: number): string {
    let colores: string;
    data < 50
      ? (colores = '#E73628') //rojo
      : data < 65
      ? (colores = '#EFB950') //amarillo
      : data < 80
      ? (colores = '#EFB950') //amarillo
      : data == 100
      ? (colores = '#47CC0C') //verde
      : (colores = '#818181'); //gris

    return colores;
  }

  gethealth(index: any) {

    let post = { applicationId: index };

    this.http.post<any>(`${environment.baseUrl}/health`, post).subscribe({
      next: this.getHealthsucces.bind(this),
      error: this.gethealthError.bind(this),
    });
  }

  getHealthsucces(response: any) {
    let getHealth: DataAplication = response;

    let data1 = getHealth.data;

    this.health_api = this.colorScheme(data1[0].health);
    this.health_loadbalancer = this.colorScheme(data1[2].health);
    this.health_db = this.colorScheme(data1[3].health);
    this.health_integration = this.colorScheme(data1[1].health);
    this.health_services = this.colorScheme(data1[4].health);

    this.message_api = data1[0].message;
    this.message_loadbalancer = data1[2].message;
    this.message_db = data1[3].message;
    this.message_integration = data1[1].message;
    this.message_services = data1[4].message;
  }

  public message_loadbalancer: string;
  public message_api: string;
  public message_services: string;
  public message_db: string;
  public message_integration: string;

  public health_loadbalancer: string;
  public health_api: string;
  public health_services: string;
  public health_db: string;
  public health_integration: string;

  gethealthError(error: any) {
    console.log(error);
  }

  // -----------------------data node ---------------------------------------

  setData(index: any) {
    this.gethealth(index);

    setTimeout(() => {
      this.data();
    }, 100);
  }

  data() {
    let http$: any = {
      nodes: [
        {
          id: 'c1',
          label: 'C1',
          data: {
            title: 'LOAD BALANCER',
            img: '../../../assets/LB_base.png',
            text: 'BALANCEADOR DE CARGA',
            link: 'loadBalancer-list',
            msg: this.message_loadbalancer,
            Color: this.health_loadbalancer,
          },
        },
        {
          id: 'c2',
          label: 'C2',
          data: {
            title: 'APIS',
            img: '../../../assets/api_base.png',
            text: 'APIS',
            msg: this.message_api,
            link: 'apis-list',
            Color: this.health_api,
          },
        },
        {
          id: 'c3',
          label: 'C3',
          data: {
            title: 'MICROSERVICES',
            img: '../../../assets/service_base.png',
            text: 'SERVICIOS',
            msg: this.message_services,
            link: 'services-list',
            Color: this.health_services,
          },
        },
        {
          id: 'c4',
          label: 'C4',
          data: {
            title: 'BASES DE DATOS',
            img: '../../../assets/db_bae.png',
            text: 'BASES DE DATOS',
            msg: this.message_db,
            link: 'persistence-list',
            Color: this.health_db,
          },
        },
        {
          id: 'c5',
          label: 'C5',
          data: {
            title: 'PIC',
            img: '../../../assets/pic_base.png',
            text: 'PIC ',
            msg: this.message_integration,
            link: 'pic-list',
            Color: this.health_integration,
          },
        },
      ],
      links: [
        {
          id: 'a',
          source: 'c1',
          target: 'c2',
          label: '',
        },
        {
          id: 'b',
          source: 'c2',
          target: 'c3',
          label: '',
        },
        {
          id: 'd',
          source: 'c3',
          target: 'c4',
          label: '',
        },
        {
          id: 'e',
          source: 'c3',
          target: 'c5',
          label: '',
        },
      ],
    };

    this.data$.next(http$);
  }
}
