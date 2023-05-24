import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-registries',
  templateUrl: './no-registries.component.html',
  styleUrls: ['./no-registries.component.css']
})
export class NoRegistriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() error: boolean = true;
}
