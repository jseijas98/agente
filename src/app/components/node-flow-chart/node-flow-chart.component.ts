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

  constructor(
    private serv: FlowChartService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {}


  redirect(prefix: any) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
      console.log(prefix, params['id']);
    });
  }
}
