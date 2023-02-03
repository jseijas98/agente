import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Applications } from '../../interfaces/model.applications';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  dataCard: Applications[] = [];

  colorScheme(data:any): Color{

    let colores = data.map((x: any)=>x.value<50?'#f44336':x.value<80?'#ffd740':'#69f0ae')

    return  {
      name: 'string',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: colores
    };
  }

 cardColor: string = '#232837';

  constructor(private router: Router, private http:HttpClient) {}

  ngOnInit(): void {
    this.aplication()
  }

  url: string ='https://180.183.170.56:30445/monitor-agent-service/list/application';

  aplication(): any{
    this.http.get(this.url).subscribe({
      next: this.aplicacionSuccess.bind(this),
      error: this.aplicacionError.bind(this)
    })
  }
  aplicacionSuccess(respose:any){
    let data: Array<Applications> = respose;
    let format: any[] =[]
    data.forEach(app => {
      format.push({
        name: app.applicationName,
        value: app.status,
      })
    })
    this.dataCard = format;
    console.log(respose);
  }

  aplicacionError(error:any){
    console.error(error);
  }

  onSelect(event: any) {
    sessionStorage.setItem('Graph', JSON.stringify(event));
    this.redirec();
  }

  redirec() {
    this.router.navigateByUrl('graph-app');
  }

  axisFormat(val: any) {
    return val.value.toString() + '%';
  }
}
