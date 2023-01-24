import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  single = [
    {
      name: 'BDV en linea Personas',
      value: 100,
      extra: 'graph-app',
    },
    {
      name: 'BDV en linea Empresas',
      value: 80,
      extra: 'graph-app',
    },
    {
      name: 'BDV Digital',
      value: 92,
      extra: 'graph-app',
    },
    {
      name: 'Punto Ya',
      value: 99,
      extra: 'graph-app',
    },
  ];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  cardColor: string = '#232837';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSelect(event: any) {
    console.log(event);
    sessionStorage.setItem('Graph', JSON.stringify(event));
    this.redirec(event.extra);
  }

  redirec(ruta: string) {
    this.router.navigateByUrl(ruta);
  }

  axisFormat(val: any) {
    console.log(val);
    return val.value.toString() + '%';
  }
}
