import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { Step, stepSquare } from 'src/app/services/flow-chart/Step';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  @Input() dataIn: any;
  @Input() legentTitleIn: any;
  @Input() xlabel: any;
  @Input() ylabel: any;
  @Input() title: any;

  curve = stepSquare;

  // options
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  constructor(public utils: StringUtils) {}

  ngOnInit(): void {
  }

  

}
