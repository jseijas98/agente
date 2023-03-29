import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { BehaviorSubject, timeout } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import {
  NewIntegration,
  NewPersistence,
  NewService,
  NewApi,
  NewLoadBalancer,
  Element,
} from 'src/app/modules/interfaces/model.add-new-element';
import { FormMessageService } from 'src/app/services/form-message/form-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-new-element-form',
  templateUrl: './add-new-element-form.component.html',
  styleUrls: ['./add-new-element-form.component.css'],
})
export class AddNewElementFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public serv: FormMessageService,
    private Utils: StringUtils
  ) {}

  public data$: BehaviorSubject<any> = new BehaviorSubject(null);
  @Output() newItemEvent = new EventEmitter<string>();

  // (ngSubmit)="clicked($event)"

  addNewItem(value: any) {
    this.newItemEvent.emit(value);
  }
 
  ngOnInit(): void {}

  newElement: Element[] = [
    { value: 'integration', viewValue: 'servicios de pic' },
    { value: 'persistence', viewValue: 'base de datos' },
    { value: 'service', viewValue: 'services' },
    { value: 'apis', viewValue: 'apis' },
    { value: 'loadbalancer', viewValue: 'load balancer' },
  ];
  
  hide = true;
  selectedValue: string;

  // **********************************PIC*********************************************
  pic: FormGroup = new FormGroup({
    testInterval: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.Utils.numberRegEx),
      Validators.min(100),
      Validators.max(60000),
    ]),
    url: new FormControl('', [Validators.required, Validators.minLength(2)]),
    json: new FormControl('', [Validators.required, Validators.minLength(2)]),
    channel: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    description: new FormControl('', [
      Validators.nullValidator,
      Validators.minLength(2),
    ]),
  });

  onSubmit_pic(
    testInterval: any,
    url: any,
    json: any,
    channel: any,
    description: any
  ) {
    let pic: NewIntegration;
    let type = 'integration';
    pic = {
      applicationId: parseInt(this.data),
      testInterval: parseInt(testInterval),
      url: url,
      json: json,
      channel: channel,
      description: description,
    };
    this.addNewElement(pic, type);
    console.log('submit', pic);
  }

  //***********************************persistense or data bases***********************
  dataBase: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    sqlSentence: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    testInterval: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.Utils.numberRegEx),
    ]),
    url: new FormControl('', [Validators.required, Validators.minLength(2)]),
    dataBaseType: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    description: new FormControl('', [
      Validators.nullValidator,
      Validators.minLength(2),
    ]),
  });

  onSubmit_DB(
    name: any,
    sqlSentence: any,
    username: any,
    password: any,
    testInterval: any,
    url: any,
    dataBaseType: any,
    description: any
  ) {
    let type = 'persistence';
    let DB: NewPersistence = {
      applicationId: parseInt(this.data),
      name: name,
      sqlSentence: sqlSentence,
      username: username,
      password: password,
      testInterval: parseInt(testInterval),
      url: url,
      dataBaseType: dataBaseType,
      description: description,
    };
    this.addNewElement(DB, type);
    console.log('submit', DB);
  }
  // ***********************************services***************************************
  service: FormGroup = new FormGroup({
    testInterval: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.Utils.numberRegEx),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    labelApp: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    namespace: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    url: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [
      Validators.nullValidator,
      Validators.minLength(2),
    ]),
  });

  onSubmit_service(
    testInterval: any,
    name: any,
    labelApp: any,
    namespace: any,
    url: any,
    description: any
  ) {
    let type = 'service';
    let service: NewService = {
      applicationId: parseInt(this.data),
      testInterval: parseInt(testInterval),
      name: name,
      labelApp: labelApp,
      namespace: namespace,
      url: url,
      description: description,
    };
    this.addNewElement(service, type);
    console.log('submit', service);
  }
  // *************************************apis*****************************************
  apis: FormGroup = new FormGroup({
    labelApp: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    namespace: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    testInterval: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.Utils.numberRegEx),
      Validators.min(100),
      Validators.max(60000),
    ]),
    url: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });
  onSubmit_apis(labelApp: any, namespace: any, testInterval: any, url: any) {
    const type = 'api';
    let api: NewApi = {
      applicationId: parseInt(this.data),
      labelApp: labelApp,
      namespace: namespace,
      testInterval: parseInt(testInterval),
      url: url,
    };
    this.addNewElement(api, type);

    console.log('submit', api);
  }
  // *******************************load balancer***************************************
  loadBalancer: FormGroup = new FormGroup({
    testInterval: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.Utils.numberRegEx),
    ]),
    url: new FormControl('', [Validators.required, Validators.minLength(2)]),
    json: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });
  onSubmit_laodBalancer(
    testInterval: any,
    url: any,
    json: any,
    description: any
  ) {
    const type = 'loadBalancer';
    let LB: NewLoadBalancer = {
      applicationId: parseInt(this.data),
      testInterval: parseInt(testInterval),
      url: url,
      json: json,
      description: description,
    };
    this.addNewElement(LB,type)
    console.log('submit', LB);
  }

  addNewElement(element: Object, type: string) {
    this.http
      .post(`${environment.baseUrl}newElement/${type}`, element)
      .subscribe({
        next: this.success.bind(this),
        error: this.error.bind(this),
      });
  }
  success(response: any) {
    this.data$.next(response);
    console.log('mensaje',response.message,'resposne',response);
  }
  
  error(error: any) {
    this.data$.error(error);
    console.log(error);
  }

}
