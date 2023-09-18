import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ServiceInfo } from '../../interfaces/model.services/model.services-list';
import { ElemnetQueryServiceService } from 'src/app/services/element-query/elemnet-query-service.service';
import {
  BodyRequest,
  BodyResponse,
  Dummybody,
  dataDummy,
} from '../../interfaces/model.add-new-element';
import {
  PayloadType,
  requestBody,
} from 'src/app/services/deleteElement/delete.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { duration } from 'moment-timezone';

@Component({
  selector: 'app-element-details',
  templateUrl: './element-details.component.html',
  styleUrls: ['./element-details.component.css'],
})
export class ElementDetailsComponent implements OnInit {
  constructor() {}

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  breadcrumbService = inject(BreadcrumbService);
  serv = inject(ElemnetQueryServiceService);
  activateRouter = inject(ActivatedRoute);
  snakbar = inject(MatSnackBar);

  public form: FormGroup;
  public onSubmit: Subject<any> = new Subject();
  public breadcrumbs: { label: string; url: string }[] = [];
  title: String;


  request: BodyRequest = Dummybody

  response: BodyResponse = dataDummy;

  ngOnInit(): void {
    // this.getElement();
    this.setForm();
    this.succes(this.response);
  }

  public setForm() {
    this.form = this.fb.group({
      valueId: new FormControl(
        { value: this.response?.data.valueId || '', disabled: false },
        []
      ),
      serviceId: new FormControl(
        { value: this.response?.data.serviceId || '', disabled: false },
        []
      ),
      valuePath: new FormControl(
        { value: this.response?.data.valuePath || '', disabled: false },
        []
      ),
      typeOfValue: new FormControl(
        { value: this.response?.data.typeOfValue || '', disabled: false },
        []
      ),
      descriptionOfValue: new FormControl(
        {
          value: this.response?.data.descriptionOfValue || '',
          disabled: false,
        },
        []
      ),
      value: new FormControl(
        { value: this.response?.data.value || '', disabled: false },
        []
      ),
      normalValueState: new FormControl(
        { value: this.response?.data.normalValueState || '', disabled: false },
        []
      ),
      warningValueState: new FormControl(
        { value: this.response?.data.warningValueState || '', disabled: false },
        []
      ),
      criticValueState: new FormControl(
        { value: this.response?.data.criticValueState || '', disabled: false },
        []
      ),
      stateAlarm: new FormControl(
        { value: this.response?.data.stateAlarm || '', disabled: false },
        []
      ),
      comparator: new FormControl(
        { value: this.response?.data.comparator || '', disabled: false },
        []
      ),
      actualStateValue: new FormControl(
        { value: this.response?.data.actualStateValue || '', disabled: false },
        []
      ),
    });
  }

  getElement() {
    this.activateRouter.params.subscribe((params) => {
      // this.breadcrumbService.agregarRuta('registry/service/'+params['id']+'/replica/'+params['ip'],'registros')
      console.log(params);
      let body: BodyRequest = {
        applicationId: params['app'],
        elementId: params['id'],
        type: params['type'],
      };
      this.sendRequest(body);
    });
  }

  sendRequest(request: BodyRequest) {
    console.log(request);

    this.serv.postRequest(request).subscribe({
      next: this.succes.bind(this),
      error: this.error.bind(this),
    });
  }

  succes(resposne: BodyResponse) {
    console.log(resposne);
    this.notify(resposne);
  }

  error(error: any) {
    console.log(error);
    this.snakbar.open('ERROR: fallo conexion con el servidor', 'ACEPTAR');
  }

  notify(response: BodyResponse) {
    if (response && response.status !== 1000) {
      const errorMessage = response.message
      ? 'error al bsucar elemento'
      : response.message;
    this.snakbar.open(`ERROR: ${errorMessage}`, 'ACEPTAR',{duration: 3000});
    }
  }

  toRequest() {
    console.log('el formulario', this.form.getRawValue());
    return this.form.getRawValue();
  }

  getRegistry() {
    const type = this.request.type;
    const id = this.response.data.serviceId;
    const url = this.serv.goRegistry(type, id);
    this.router.navigateByUrl(url);
  }

  getReplicas() {
    const type = this.request.type;
    const id = this.response.data.serviceId;
    const url = this.serv.goReplica(type, id);
    this.router.navigateByUrl(url);
  }
}
