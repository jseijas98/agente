import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject } from 'rxjs';
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

  //data de la charts cards
  dataCard: Applications[] = [];

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
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    this.aplication();
  }

  //url de las aplicaciones

  url = environment.baseUrl;

  //formato del valor numerico
  axisFormat(val: any) {
    return val.value.toString() + '%';
  }

  //funcion para obtener la de data de las aplicacione desde el api
  aplication(): any {
    this.http.get(this.url+'list/application').subscribe({
      next: this.aplicacionSuccess.bind(this),
      error: this.aplicacionError.bind(this),
    });
  }

  //TODO obntener dato del hhtp para pasarle el % de sauld al main component por un view child

  aplicacionSuccess(respose: any) {
    let data: Array<Applications> = respose;
    let format: any[] = [];
    data.forEach((app) => {
      format.push({
        name: app.applicationName,
        value: app.status,
        extra: app.applicationId,
      });
    });
    this.dataCard = format;
    console.log(respose);
  }

  aplicacionError(error: any) {
    console.error(error);
  }

  //funcion para redirigir a los elemntos de una aplicacion especifico
  onSelect(event: any) {
    sessionStorage.setItem('Graph', JSON.stringify(event));
    let id = JSON.parse(event['extra']);
    this.redirec(id);

    console.log(event);
  }

  redirec(app_id: any) {
    this.router.navigateByUrl(`graph-app/${app_id}`);
    console.log(app_id);
  }



  
}
