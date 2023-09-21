import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';
import { DataAplication } from '../../interfaces/model.componetList/componentList';
import { stepRound } from 'src/app/services/flow-chart/stepRound';
@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements OnInit, OnDestroy {
  constructor(
    public flowChartService: FlowChartService,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private appName: AppNameService,
    private sseServiceService: SseServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  public graph: string;
  unsuscribe$ = new Subject<void>();
  update$: Subject<boolean> = new Subject();

  public dimensions: [number, number] = [0, 0];

  //--------------------------------------------Oninit()-----------------------------------
  ngOnInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.sseGetHealth(params['id']);
      this.appName
        .getDataFromApi(params['id'])
        .subscribe((data) => (this.graph = data));
    });
  }

  ngAfterViewInit(): void {
    this.flowChartService.zoneDimensions$.subscribe(([w, h]) => {
      if (w && h) {
        this.dimensions = [w -200 , h];
        console.log(this.dimensions);
        this.cdr.detectChanges();
        this.update$.next(true);
      }
    });
  }
  //---------------------------------------------------------------------------------------

  ngOnDestroy(): void {
    this.closeConect();
    this.unsusbribe();
    this.sseServiceService.closeEventSource();
  }

  unsusbribe() {
    console.log('se desuscribio');
    this.unsuscribe$.complete();
    this.unsuscribe$.next();
  }

  redirect(prefix: string) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
    });
  }

  //conexion sse
  sseGetHealth(index: any) {
    this.sseServiceService
      .getDataFromServer(`${environment.baseUrl}health/application/${index}`)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe((data) => {
        console.log(data);

        let getHealth: DataAplication = data;
        let data1 = getHealth.data;
        this.health_api = this.colorScheme(data1[0].health);
        this.health_integration = this.colorScheme(data1[2].health);
        this.health_loadbalancer = this.colorScheme(data1[3].health);
        this.health_db = this.colorScheme(data1[4].health);
        this.health_services = this.colorScheme(data1[1].health);
        this.message_api = data1[0].message;
        this.message_integration = data1[2].message;
        this.message_loadbalancer = data1[3].message;
        this.message_db = data1[4].message;
        this.message_services = data1[1].message;
        this.data();
        this.datanode();
        this.update$.next(true);
      });
  }

  closeConect() {
    console.log('se cerro la conexion');
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
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
            text: 'BALANCEADORES',
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

  public data$: BehaviorSubject<any> = new BehaviorSubject(null);

  colorScheme(data: number): string {
    let color: string;

    if (data < 50) {
      color = '#E73628'; // rojo
    } else if (data < 65 || data < 80) {
      color = '#EFB950'; // amarillo
    } else if (data === 100) {
      color = '#47CC0C'; // verde
    } else if (data < 99) {
      color = '#A0D41C'; // verde amarillento
    } else {
      color = '#818181'; // gris
    }

    return color;
  }

  public layoutSettings = {
    orientation: 'LR', // Left to Right
  };

  curve = stepRound;
  dataNode: Array<any> = [];
  dataLink: Array<any> = [];

  datanode() {
    this.data$.subscribe((data) => {
      if (data) this.dataNode = data.nodes;
      this.dataLink = data.links;
    });
    console.log('Data ------->', this.dataLink, this.dataNode);
  }
}
