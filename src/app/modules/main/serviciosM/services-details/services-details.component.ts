import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInfo } from 'src/app/modules/interfaces/model.services/model.services-list';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { Location } from '@angular/common'
import { PayloadType } from 'src/app/services/deleteElement/delete.service';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.css']
})
export class ServicesDetailsComponent implements OnInit, OnDestroy  {

  ngOnDestroy(): void {
  }

  activatedRoute = inject(ActivatedRoute)
  router =inject(Router);
  fb = inject(FormBuilder);
  breadcrumbService = inject(BreadcrumbService)
  location = inject(Location);
  servicesDetails:ServiceInfo;
  public form: FormGroup;
  public onSubmit: Subject<any> = new Subject();
  public breadcrumbs: { label: string; url: string }[] = [];

 public setForm() {
      this.form = this.fb.group({
          type:  new FormControl({ value:PayloadType.SERVICE, disabled: true }, []),
          ElementId: new FormControl({ value: this.servicesDetails.Id, disabled: true }, []),
          url:  new FormControl({ value:this.servicesDetails.base_url, disabled: false }, []),
          testInterval:  new FormControl({ value:this.servicesDetails.test_interval, disabled: false }, []),
          description:  new FormControl({ value: this.servicesDetails.description, disabled: false }, []),
          labelApp:  new FormControl({ value: this.servicesDetails.label_app, disabled: false }, []),
          namespace:  new FormControl({ value:this.servicesDetails.nameSpace, disabled: false }, []),
          warningTrigger:  new FormControl({value:this.servicesDetails.warningTrigger, disabled: false }, []),
          criticalTrigger:  new FormControl({ value:this.servicesDetails.criticalTrigger, disabled: false }, []),
        });
      }


      // {
      //   "type": "String", <----------(obligatorio)
      //   "ElementId": 0, <----------(obligatorio)
      //   "url": "String",
      //   "testInterval": 0,
      //   "description": "String",
      //   "labelApp": "String",
      //   "namespace": "String",
      //   "json": "String",
      //   "channel": "String",
      //   "warningTrigger": 0,
      //   "criticalTrigger": 0
      // }

      toRequest() {
          console.log('el formulario',this.form.getRawValue());
          return this.form.getRawValue();
      }

      submit() {
          this.onSubmit.next(this.toRequest());
      }

  info:ServiceInfo;// Objeto FormGroup para manejar el formulario

  ngOnInit(): void {
    this.obtenerRutasDesdeLocalStorage();
    this.getDetails(this.getParams())
    this.setForm();
    console.log('hola',this.form.getRawValue());
    this.breadcrumbService.agregarRuta(this.router.url,this.servicesDetails.label_app);
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();

  }

  title: String;

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
        return parse

      } else {
        console.log("El parámetro 'id' no está presente en la URL.");
        // Puedes hacer alguna acción aquí si 'id' es nulo
        return {};
      }
    } catch (e) {
      console.log("Ocurrió un error al extraer el parámetro.");
      // Puedes hacer alguna acción aquí si ocurre un error
      return {};
    }
  }

  getDetails(serviceInfo: ServiceInfo) {
    console.log("ServiceInfo", serviceInfo);
  this.title = serviceInfo.label_app;
  this.servicesDetails = serviceInfo;
  }

  nuevasrutas(): any[] {
    let rutas: any[] = this.obtenerRutasDesdeLocalStorage();
    rutas.push({ label: this.servicesDetails.label_app, url: this.router.url });
    return rutas;
  }


  loadRuta() {
    this.breadcrumbService.agregarRuta(this.router.url,this.servicesDetails.label_app);
}

  getServicesReplica(): void {
    this.loadRuta();
    this.router.navigateByUrl(`services-replicas/${this.servicesDetails.Id}`);
  }

  Registry() {
    this.loadRuta();
    this.router.navigateByUrl(`services-registry/${this.servicesDetails.Id}`);
  }


}
