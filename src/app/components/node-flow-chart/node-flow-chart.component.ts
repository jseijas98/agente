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

  verde_amarillo='invert(77%) sepia(63%) saturate(588%) hue-rotate(23deg) brightness(93%) contrast(90%)';

  redtext = '#E73628';

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private serv: FlowChartService
  ) {}

  ngOnInit(): void {}

  colorScheme(data: string): string {
    const red = 'invert(46%) sepia(82%) saturate(6915%) hue-rotate(349deg) brightness(95%) contrast(90%)';
    const yellow = 'invert(90%) sepia(87%) saturate(5956%) hue-rotate(314deg) brightness(94%) contrast(99%)';
    const green = 'invert(70%) sepia(88%) saturate(389%) hue-rotate(53deg) brightness(91%) contrast(89%)';
    const gray = 'invert(45%) sepia(38%) saturate(10%) hue-rotate(142deg) brightness(104%) contrast(93%)';
    const verde_amarillo = 'invert(77%) sepia(63%) saturate(588%) hue-rotate(23deg) brightness(93%) contrast(90%)';
  
    let color: string;
  
    switch (data) {
      case '#E73628':
        color = red; // rojo
        break;
      case '#EFB950':
        color = yellow; // amarillo
        break;
      case '#47CC0C':
        color = green; // verde
        break;
      case '#A0D41C':
        color = verde_amarillo; // verde amarillo
        break;
      default:
        color = gray; // gris
        break;
    }
  
    return color;
  }

  redirect(prefix: any) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
      console.log(prefix, params['id']);
    });
  }
}
