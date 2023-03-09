import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
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

  // calculateDimensions(el: HTMLElement): void {
  //   const { width, height } = el.getBoundingClientRect();
  //   console.log(width, height);
  //   this.zoneDimensions$.next([width, height]);
  // }
  
  url = environment.baseUrl;


  // ---------------------apis health----------------------------

  gethelalth_apis(index: any) {
    this.http
      .get<any>(`${this.url}health/application/${index}/apis`)
      .subscribe({
        next: this.getHealthSussefull_apis.bind(this),
        error: this.gethealthError_apis.bind(this),
      });
  }

 

  public apis$: BehaviorSubject<any> = new BehaviorSubject(null);
  public apisIMG$: BehaviorSubject<any> = new BehaviorSubject(null);

  getHealthSussefull_apis(response: any) {
    let getHealthSussefull: ComponentListApis = response;

    let apisHealt = getHealthSussefull.health;

    this.apisIMG$.next(this.colorIMG_apis(apisHealt))
    this,this.apis$.next(this.colorScheme(apisHealt))

  }

  gethealthError_apis(error: any) {
    this.apisIMG$.next(this.colorIMG_apis(error))
    this,this.apis$.next(this.colorScheme(error))
  }

  // -------------------esquema de colores----------------------------

  colorScheme(data: number): string {
    let colores!: string;

    data < 50
      ? (colores = 'red')
      : data < 65
      ? (colores = 'orange')
      : data < 80
      ? (colores = 'yellow')
      : data == 100
      ? (colores = 'green')
      : (colores = 'gray');

    return colores;
  }

  colorIMG_apis(data: number): string {
    let img!: string;

    data < 50
      ? (img = '../../../assets/verde_api (1).png')
      : data < 65
      ? (img = '../../../assets/amarillo_api (2).png')
      : data < 80
      ? (img = '../../../assets/amarillo_api (2).png')
      : data == 100
      ? (img = '../../../assets/verde_api (1).png')
      : (img = '../../../assets/GRIS-API.png');

    return img;
  }

  // ----------------------------healt loadbalancing------------------

  gethelalth_loadBalnacer(index: any) {
    this.http
      .get<any>(
        `${environment.baseUrl}health/application/${index['id']}/loadBalancer`
      )
      .subscribe({
        next: this.getHealthSussefull__loadBalnacer.bind(this),
        error: this.gethealthError_loadBalnacer.bind(this),
      });
  }

  getHealthSussefull__loadBalnacer(response: any) {
    let getHealthSussefull: ComponentListApis = response;

    let LBHealt = getHealthSussefull.health;

    this.LBcolor$.next(this.colorScheme(LBHealt));
    this.LBimg$.next(this.colorIMG_LB(LBHealt));


  }

  public LBcolor$: BehaviorSubject<any> = new BehaviorSubject(null);
  public LBimg$: BehaviorSubject<any> = new BehaviorSubject(null);


  colorIMG_LB(data: number): string {
    let img!: string;

    data < 50
      ? (img = '../../../assets/rojo_loadbalancer.png')
      : data < 65
      ? (img = '../../../assets/amarillo_loadbalancer.png')
      : data < 80
      ? (img = '../../../assets/amarillo_loadbalancer.png')
      : data == 100
      ? (img = '../../../assets/verde_loadbalancer.png')
      : (img = '../../../assets/GRIS-LB.png');

    return img;
  }

  gethealthError_loadBalnacer(error: any) {
    this.LBcolor$.next(this.colorScheme(error));
    this.LBimg$.next(this.colorIMG_LB(error));

    console.log(error);
  }

  // ------------------------------healt service-------------------------

  gethelalth_services(index: any) {
    this.http
      .get<any>(`${this.url}health/application/${index}/service`)
      .subscribe({
        next: this.getHealthSussefull__services.bind(this),
        error: this.gethealthError_services.bind(this),
      });
  }

  colorIMG_services(data: number): string {
    let img!: string;

    data < 50
      ? (img = '../../../assets/rojo_services.png')
      : data < 65
      ? (img = '../../../assets/amarillo_services.png')
      : data < 80
      ? (img = '../../../assets/amarillo_services.png')
      : data == 100
      ? (img = '../../../assets/verde_services.png')
      : (img = '../../../assets/GRIS-SERV.png');

    return img;
  }

  public services_color$: BehaviorSubject<any> = new BehaviorSubject(null);
  public services_img$: BehaviorSubject<any> = new BehaviorSubject(null);

  service_color:string;
  services_IMG:string;

  getHealthSussefull__services(response: any) {
    let getHealthSussefull: ComponentListService = response;

    let service_Healt = getHealthSussefull.health;

    this.service_color = this.colorScheme(service_Healt)
    this.services_IMG = this.colorIMG_services(service_Healt)
    

    console.log('color services aa', this.services_color$.getValue());
    console.log('img services aa', this.services_img$.getValue());
  }

  gethealthError_services(error: any) {
    this.services_color$.next(this.colorScheme(error));
    this.services_img$.next(this.colorIMG_services(error));

    console.log(error);
  }

  // ----------------------------------health persistence------------------

  gethelalth_persistencias(index: any) {
    this.http
      .get<any>(`${this.url}health/application/${index}/persistence`)
      .subscribe({
        next: this.getHealthSussefull_persistencias.bind(this),
        error: this.gethealthError_persistencias.bind(this),
      });
  }
  colorIMG_persistence(data: number): string {
    let img!: string;

    data < 50
      ? (img = '../../../assets/db_rojo.png')
      : data < 65
      ? (img = '../../../assets/db_amarillo (3).png')
      : data < 80
      ? (img = '../../../assets/db_amarillo (3).png')
      : data == 100
      ? (img = '../../../assets/db_verde.png')
      : (img = '../../../assets/GRIS-DB.png');

    return img;
  }

  public persistence_color$: BehaviorSubject<any> = new BehaviorSubject(null);
  public persistence_img$: BehaviorSubject<any> = new BehaviorSubject(null);

  getHealthSussefull_persistencias(response: any) {
    let getHealthSussefull: ComponentListPersistence = response;

    let persistence_Healt = getHealthSussefull.health;

    this.persistence_color$.next(this.colorScheme(persistence_Healt));
    this.persistence_img$.next(this.colorIMG_persistence(persistence_Healt));

    console.log('aa', this.persistence_color$.getValue());
    console.log('aa', this.persistence_img$.getValue());
  }

  gethealthError_persistencias(error: any) {
    this.persistence_color$.next(this.colorScheme(error));
    this.persistence_img$.next(this.colorIMG_services(error));

    console.log(error);
  }

  // ---------------------------health pic-------------------------------

  gethelalth_pic(index: any) {
    this.http
      .get<any>(`${this.url}health/application/${index}/integration`)
      .subscribe({
        next: this.getHealthSussefull_pic.bind(this),
        error: this.gethealthError_pic.bind(this),
      });
  }

  colorIMG_pic(data: number): string {
    let img!: string;

    data < 50
      ? (img = '../../../assets/rojo_pic.png')
      : data < 65
      ? (img = '../../../assets/amarillo_pic.png')
      : data < 80
      ? (img = '../../../assets/amarillo_pic.png')
      : data == 100
      ? (img = '../../../assets/amarillo_pic.png')
      : (img = '../../../assets/GRIS-PIC.png');

    return img;
  }

 
  public pic_color$: BehaviorSubject<any> = new BehaviorSubject(null);
  public pic_img$: BehaviorSubject<any> = new BehaviorSubject(null);

  getHealthSussefull_pic(response: any) {
    let getHealthSussefull: ComponentListIntegration = response;

    let pic_Healt = getHealthSussefull.health;

    this.pic_color$.next(this.colorScheme(pic_Healt));
    this.pic_img$.next(this.colorIMG_pic(pic_Healt));

    console.log(' aa', this.pic_color$.getValue());
    console.log('aa', this.pic_img$.getValue());
  }

  gethealthError_pic(error: any) {
    this.pic_color$.next(this.colorScheme(error));
    this.pic_img$.next(this.colorIMG_pic(error))

    console.log(error);
  }

  //----------------------nuevo llamado-------------------------------------

  gethealth(index: any) {
    this.http
      .post<any>(`${this.url}/health`, `application:${index}`)
      .subscribe({
        next: this.getHealthsucces.bind(this),
        error: this.gethealthError.bind(this),
      });
  }

  getHealthsucces(response: any) {
    let getHealth: Componente = response;

    let data = getHealth.data;
    console.log(data);
  }

  nuevoGetHealt() {}

  gethealthError(error: any) {}

  // -----------------------data node ---------------------------------------

   setData(index: any) {

    this.gethelalth_loadBalnacer(index);
    this.gethelalth_apis(index);
    this.gethelalth_services(index);
    this.gethelalth_pic(index);
    this.gethelalth_persistencias(index);

  this.data()
    

   }

    data(){

      console.log('paso 1 seg');
      

      const http$ : any = {
        nodes: [
          {
            id: 'c1',
            label: 'C1',
            data: {
              title: 'LOAD BALANCER',
              img: this.LBimg$.getValue(),
              text:
                '<font ' +
                'color=' +
                this.LBcolor$.getValue() +
                '>' +
                'BALANCEADOR DE CARGA</font>',
              link: '',
              msg: 'mesaje sin definir',
            },
          },
          {
            id: 'c2',
            label: 'C2',
            data: {
              title: 'APIS',
              img: this.apisIMG$.getValue(),
              text: '<font ' + 'color=' + this.apis$.getValue() + '>' + 'APIS </font>',
              msg: '8/8 apis funcionales',
              link: 'apis-list',
            },
          },
          {
            id: 'c3',
            label: 'C3',
            data: {
              title: 'MICROSERVICES',
              img: this.services_IMG,
              text:
                '<font ' +
                'color=' +
                this.service_color +
                '>' +
                'SERVICIOS</font>',
              msg: 'mesaje sin definir',
              link: 'services-list',
            },
          },
          {
            id: 'c4',
            label: 'C4',
            data: {
              title: 'BASES DE DATOS',
              img: this.persistence_img$.getValue(),
              text:
                '<font ' +
                'color=' +
                this.persistence_color$.getValue() +
                '>' +
                'BASES DE DATOS </font>',
              msg: 'mesaje sin definir',
              link: 'persistence-list',
            },
          },
          {
            id: 'c5',
            label: 'C5',
            data: {
              title: 'PIC',
              img: this.pic_img$.getValue(),
              text: '<font ' + 'color=' + this.pic_color$.getValue() + '>' + 'PIC </font>',
              msg: 'mesaje sin definir pic',
              link: 'pic-list',
            },
          },
        ],
        links: [
          {
            id: 'a',
            source: 'c1',
            target: 'c2',
            label: 'is parent of',
          },
          {
            id: 'b',
            source: 'c2',
            target: 'c3',
            label: 'custom label',
          },
          {
            id: 'd',
            source: 'c3',
            target: 'c4',
            label: 'custom label',
          },
          {
            id: 'e',
            source: 'c3',
            target: 'c5',
            label: 'first link',
          },
        ],
      };
  
      this.data$.next(http$)
        
        console.log('data node', this.data$);
    }


    }


    

