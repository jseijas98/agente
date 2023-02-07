import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-chart-node',
  templateUrl: './flow-chart-node.component.html',
  styleUrls: ['./flow-chart-node.component.css']
})
export class FlowChartNodeComponent implements OnInit {

  @Input() dataIn: any;
  constructor() { }

  ngOnInit(): void {
  }

}
