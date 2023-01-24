import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements OnInit {
  public graph: any = JSON.parse(sessionStorage.getItem('Graph')!);

  constructor() {}

  ngOnInit() {}
}