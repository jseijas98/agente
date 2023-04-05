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
import { BehaviorSubject } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { environment } from 'src/environments/environment';
import { Applications } from '../../interfaces/model.applications';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public application$: BehaviorSubject<any> = new BehaviorSubject(null);

  dataCard: any[] = [];

  //data de la charts cards

  //esquema de colores de las charts cards
  colorScheme(data: any): Color {
    let colores = data.map((x: any) =>
      x.value < 50 ? '#f44336' : x.value < 80 ? '#ffd740' : '#69f0ae'
    );

    return {
      name: 'string',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: colores,
    };
  }

  cardColor: string = '#232837';

  constructor(
    private router: Router,
    private appName: AppNameService
  ) {}

  ngOnInit(): void {
    this.appName.getApps().subscribe((apps) => (this.dataCard = apps));
  }

   //formato del valor numerico
  axisFormat(val: any) {
    return val.value.toString() + '%';
  }

  app_name: string


  //funcion para redirigir a los elemntos de una aplicacion especifico
  onSelect(event: any) {

    this.appName.getApps().subscribe((apps) => (this.dataCard = apps));


    sessionStorage.setItem('Graph', JSON.stringify(event));
    let id = JSON.parse(event['extra']);
    this.redirec(id);

    console.log('evento',event);
  }

  redirec(app_id: any) {
    this.router.navigateByUrl(`graph-app/${app_id}`);
    console.log(app_id);
  }
}
