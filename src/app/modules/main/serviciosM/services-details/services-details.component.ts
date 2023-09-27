import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceResponse } from 'src/app/modules/interfaces/model.services/model.services-list';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { Location } from '@angular/common';
import { PayloadType } from 'src/app/services/deleteElement/delete.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/app/modules/interfaces/model.apis/model.getApis';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.css'],
})
export class ServicesDetailsComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    this.obtenerData();
    console.log(this.breadcrumbService.breadcrumbs);
    
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void { }

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  breadcrumbService = inject(BreadcrumbService);
  http = inject(HttpClient);
  location = inject(Location);
  public form: FormGroup;
  public onSubmit: Subject<any> = new Subject();
  public breadcrumbs: { label: string; url: string }[] = [];
  servicesDetails: ServiceResponse;
  update = false;
  private snakbar = inject(MatSnackBar);

  title: String;

  public setForm() {
    this.form = this.fb.group({
      type: new FormControl({ value: PayloadType.SERVICE, disabled: true }),
      elementId: new FormControl({
        value: this.servicesDetails.serviceId,
        disabled: true,
      }),
      url: new FormControl({
        value: this.servicesDetails.testUrl,
        disabled: false,
      }),
      testInterval: new FormControl({
        value: this.servicesDetails.testInterv,
        disabled: false,
      }),
      description: new FormControl({
        value: this.servicesDetails.description,
        disabled: false,
      }),
      labelApp: new FormControl({
        value: this.servicesDetails.labelApp,
        disabled: false,
      }),
      nameSpace: new FormControl({
        value: this.servicesDetails.nameSpace,
        disabled: false,
      }),
      warningTrigger: new FormControl({
        value: this.servicesDetails.warningTrigger,
        disabled: false,
      }),
      criticalTrigger: new FormControl({
        value: this.servicesDetails.criticalTrigger,
        disabled: false,
      }),
    });
  }

  obtenerRutasDesdeLocalStorage(): any[] {
    const rutasJSON = localStorage.getItem('rutasGuardadas');
    if (rutasJSON) {
      return JSON.parse(rutasJSON);
    }
    return [];
  }

  getParams() {
    try {
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        let parse = JSON.parse(atob(id));
        return parse;
      } else {
        console.log("El parámetro 'id' no está presente en la URL.");
        this.update = false;
        return {};
      }
    } catch (e) {
      console.log('Ocurrió un error al extraer el parámetro.');
      this.update = false;
      return {};
    }
  }

  nuevasrutas(): any[] {
    let rutas: any[] = this.obtenerRutasDesdeLocalStorage();
    rutas.push({ label: this.servicesDetails.labelApp, url: this.router.url });
    return rutas;
  }

  loadRuta() {
    this.breadcrumbService.agregarRuta(
      this.router.url,
      this.servicesDetails.labelApp
    );
  }

  getServicesReplica(): void {
    this.loadRuta();
    this.router.navigateByUrl(
      `services-replicas/${this.servicesDetails.serviceId}`
    );
  }

  Registry() {
    this.loadRuta();
    this.router.navigateByUrl(
      `services-registry/${this.servicesDetails.serviceId}`
    );
  }

  GoMetrics() {
    this.loadRuta();
    this.router.navigateByUrl(
      `service-values/${this.servicesDetails.applicationId}/${this.servicesDetails.serviceId}`
    );
  }


  obtenerData() {
    const url = environment.url.element;
    this.http.post(url, this.getParams()).subscribe({
      next: this.success.bind(this),
      error: this.error.bind(this),
      complete: () => console.log('completed'),
    });
  }

  success(response: any) {
    console.log('response', response.data);
    this.servicesDetails = response.data;
    this.breadcrumbService.agregarRuta(this.router.url, response.data.labelApp);
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    this.title = this.servicesDetails.labelApp;
    this.setForm();
    this.update = true;
  }

  error(error: any) {
    this.update = false;
    console.log(error);
  }

  toRequest() {
    console.log('el formulario', this.form.getRawValue());
    return this.form.getRawValue();
  }

  edit() {
    const url = environment.url.modify;
    this.http.post(url, this.toRequest()).subscribe({
      next: this.successedit.bind(this),
      error: this.errroredit.bind(this),
    });
  }

  successedit(response: any) {
    this.obtenerData();
    this.snackbar(response);
    console.log('response', response);
  }

  errroredit(error: any) {
    const message = error?.name
    const code = error?.error?.code
    if (code !== 400) {
      this.snakbar.open(`${message}`, 'ACEPTAR', { duration: 2000 });
    }
    this.snakbar.open(`${code}` + " BAD REQUEST", 'ACEPTAR', { duration: 2000 });
    console.log('error', error);
    this.setForm();
  }

  snackbar(response: ResponseModel) {
    let message = response.message;
    if (message) {
      message =
        response?.status !== 1000 ? 'ERROR: al modificar' : response?.message;

      this.snakbar.open(`${message}`, 'ACEPTAR', { duration: 2000 });
    }
  }
}
