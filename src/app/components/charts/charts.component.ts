import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  public multi = [
    
    {
      "name": "apigateway",
      "series": [
        {
          "value": 100,
          "name": "2016-09-21T23:49:36.750Z"
        },
        {
          "value": 90,
          "name": "2016-09-21T01:40:57.828Z"
        },
        {
          "value": 88,
          "name": "2016-09-23T22:06:41.418Z"
        },
        {
          "value": 99,
          "name": "2016-09-14T23:10:28.834Z"
        },
        {
          "value": 100,
          "name": "2016-09-14T04:28:15.348Z"
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  pedro(event:any): void {
    let pedro = this.multi.find(x=>x.name == event)
    console.log(pedro)
  }

  onSelect(multi: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(multi)));
  }



}
