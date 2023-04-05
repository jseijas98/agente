import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';

@Component({
  selector: 'app-node-flow-chart',
  templateUrl: './node-flow-chart.component.html',
  styleUrls: ['./node-flow-chart.component.css'],
})
export class NodeFlowChartComponent implements OnInit {
  @Input() dataIn: any;

  @Input()
  ngStyle: { [klass: string]: any };

  red =
    'invert(46%) sepia(82%) saturate(6915%) hue-rotate(349deg) brightness(95%) contrast(90%)';
  yellow =
    ' invert(90%) sepia(87%) saturate(5956%) hue-rotate(314deg) brightness(94%) contrast(99%)';
  green =
    'invert(70%) sepia(88%) saturate(389%) hue-rotate(53deg) brightness(91%) contrast(89%)';
  gray =
    'invert(45%) sepia(38%) saturate(10%) hue-rotate(142deg) brightness(104%) contrast(93%)';

  redtext = '#E73628';

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private serv: FlowChartService
  ) {}

  ngOnInit(): void {}

  colorScheme(data: string): string {

    let colores: string;

    data == '#E73628'
      ? (colores = this.red) //rojo
      : data == '#EFB950'
      ? (colores = this.yellow) //amarillo
      : data == '#EFB950'
      ? (colores = this.yellow) //amarillo
      : data == '#47CC0C'
      ? (colores = this.green) //verde
      : (colores = this.gray); //gris

    return colores;
  }

  redirect(prefix: any) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
      console.log(prefix, params['id']);
    });
  }
}
