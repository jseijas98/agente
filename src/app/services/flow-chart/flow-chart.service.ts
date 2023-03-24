import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { async, BehaviorSubject, from, of, timeout } from 'rxjs';
import { ComponentListApis } from 'src/app/modules/interfaces/model.componetList/componentListApis';
import { ComponentListIntegration } from 'src/app/modules/interfaces/model.componetList/componentListIntegration';
import { ComponentListPersistence } from 'src/app/modules/interfaces/model.componetList/componentListPersistence';
import { ComponentListService } from 'src/app/modules/interfaces/model.componetList/componetListServices';
import { environment } from 'src/environments/environment';
import {
  Componente,
  ComponentList,
} from '../../modules/interfaces/model.componetList/componentList';
@Injectable({
  providedIn: 'root',
})
export class FlowChartService {
  public zoneDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([0, 0]);
  public data$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  calculateDimensions(el: HTMLElement): void {
    const { width, height } = el.getBoundingClientRect();
    console.log(width, height);
    this.zoneDimensions$.next([width, height]);
  }

  url = environment.baseUrl;

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

  //----------------------nuevo llamado-------------------------------------

  gethealth(index: any) {
    let post = { applicationId: index };

    this.http.post<any>(`${this.url}/health`, post).subscribe({
      next: this.getHealthsucces.bind(this),
      error: this.gethealthError.bind(this),
    });
  }

  //TODO: add count of elements is over the 100% health status

  getHealthsucces(response: any) {
    let getHealth: Componente = response;

    let data = getHealth.data;

    this.health_api = this.colorScheme(data[0].health);
    this.health_loadbalancer = this.colorScheme(data[2].health);
    this.health_db = this.colorScheme(data[3].health);
    this.health_integration = this.colorScheme(data[1].health);
    this.health_services = this.colorScheme(data[4].health);

  }

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
            msg: 'mesaje sin definir',
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
            msg: '8/8 apis funcionales',
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
            msg: 'mesaje sin definir',
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
            msg: 'mesaje sin definir',
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
            msg: 'mesaje sin definir pic',
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
