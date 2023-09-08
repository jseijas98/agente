import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { environment } from 'src/environments/environment';
import { Applications } from '../../interfaces/model.applications';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public application$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private appName: AppNameService,

    private sseServiceService: SseServiceService
  ) { }

  
  colorScheme(data: any): Color {
    const colores: string[] = data.map((x: any) => {
      let value=x.value;
      if (value < 50) {
        return '#E73628'; // rojo
      } else if (value < 65) {
        return '#EFB950'; // amarillo
      } else if (value < 90) {
        return '#EFB950'; // amarillo
      } else if (value >= 90) {
        return '#A0D41C'; // verde-amarillo
      } else if (value === 100) {
        return '#77BD0F'; // verde
      } else {
        return '#818181'; // gris
      }
    });
  
    return {
      name: 'string',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: colores,
    };
  }



  cardColor: string = '#232837';
  app_name: string;
  dataCard: any[] = [];

  unsuscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    // this.sseServiceService.closeEventSource();
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.appName.dashboard().subscribe((apps:any[]) => {
      this.dataCard = apps? this.dataCard= apps : [];
    });
    
  }


  //formato del valor numerico
  axisFormat(val: any) {
    return val.value.toString() + '%';
  }

  //funcion para redirigir a los elemntos de una aplicacion especifico
  onSelect(event: any) {
    this.appName.getApps().subscribe((apps) => (this.dataCard = apps));

    sessionStorage.setItem('Graph', JSON.stringify(event));
    let id = JSON.parse(event['extra']);
    this.redirec(id);

    console.log('evento', event);
  }

  redirec(app_id: any) {
    this.router.navigateByUrl(`graph-app/${app_id}`);
    console.log(app_id);
  }
}
