import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Applications } from '../interfaces/model.applications';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor( private http:HttpClient) {}

  ngOnInit(): void {

  }
  
  name: string = 'Application'
  
  algo() :string{

    return this.name
  }
    
  }
  


  

