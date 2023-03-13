import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Applications } from '../interfaces/model.applications';
import { Location } from '@angular/common'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  //TODO: viewchild, data of porcents of healthcheck status pass to main component

  goBackToPrevPage(): void {
    this.location.back();
  }
}
