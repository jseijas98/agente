import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  @Input() legend1: any;
  @Input() legend2: any;
  @Input() dataIsEmpty: boolean;

  curve = stepSquare;


  schemeType: string = 'linear';

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


   // Dimensiones iniciales de la gráfica
   chartWidth: number = 1250; // ancho inicial 
   chartHeight: number = 400; // altura inicial 

    // Detecta cambios en el tamaño de la ventana del navegador
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Actualiza las dimensiones de la gráfica en función del tamaño del contenedor
    this.updateChartDimensions();
  }

  // Función para actualizar las dimensiones de la gráfica
  updateChartDimensions() {
    
    const container = document.querySelector('.chart-container'); 
    if (container) {
      this.chartWidth = container.clientWidth; 
      this.chartHeight = container.clientHeight; 
    }
  }


}
