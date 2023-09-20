import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ServiceInfo } from 'src/app/modules/interfaces/model.services/model.services-list';
import { GetApis } from 'src/app/modules/interfaces/model.apis/model.getApis';

@Component({
  selector: 'app-apis-details',
  templateUrl: './apis-details.component.html',
  styleUrls: ['./apis-details.component.css']
})
export class ApisDetailsComponent implements OnInit {


  activatedRoute = inject(ActivatedRoute)
  router =inject(Router);  
  fb = inject(FormBuilder);
  apis:GetApis;
  public form: FormGroup;
  public onSubmit: Subject<any> = new Subject();
  breadcrumbService = inject(BreadcrumbService)
  public breadcrumbs: { label: string; url: string }[] = [];

 public setForm() {
      this.form = this.fb.group({
          Id: new FormControl({ value:this.apis.apiId, disabled: true }, []),
          nameSpace:  new FormControl({ value:this.apis.nameSpace, disabled: false }, []),
          test_interval:  new FormControl({ value:this.apis.testInterv, disabled: false }, []),
          label_app:  new FormControl({ value:this.apis.label_app, disabled: false }, []),
          health:  new FormControl({ value:this.apis.health, disabled: false }, []),
          applId:  new FormControl({ value:this.apis.applicationId, disabled: true }, []),
          warningTrigger:  new FormControl({value:this.apis.warningTrigger, disabled: false }, []),
          criticalTrigger:  new FormControl({ value:this.apis.criticalTrigger, disabled: false }, []),
          warningAlarm:  new FormControl({ value:this.apis.warningAlarm, disabled: false }, []),
          criticalAlarm:  new FormControl({ value:this.apis.criticalAlarm, disabled: false }, []),
          testUrl:  new FormControl({ value:this.apis.base_url, disabled: false }, []),
        });
      }

      toRequest() {
          console.log('el formulario',this.form.getRawValue());
          return this.form.getRawValue();
      }

      submit() {
          this.onSubmit.next(this.toRequest());
      }
  
  title: String;
  info:GetApis;// Objeto FormGroup para manejar el formulario

  ngOnInit(): void {
    this.obtenerRutasDesdeLocalStorage();
    this.getDetails(this.getParams())
    this.setForm();
    console.log("hola",this.apis);
    
    console.log('hola',this.form.getRawValue());
    this.breadcrumbService.agregarRuta(this.router.url,this.apis.label_app);
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
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

  getDetails(info: GetApis) {
    console.log("info", info);
  this.title = info.label_app;
  this.apis = info;
  }


  loadRuta() {
    this.breadcrumbService.agregarRuta(this.router.url,this.apis.label_app);
}

  getServicesReplica(): void {
    this.loadRuta();
    this.router.navigateByUrl(`apis-replicas/${this.apis.apiId}`);
  }

  Registry() {
    this.loadRuta();
    this.router.navigateByUrl(`apis-registry/${this.apis.apiId}`);
  }
  


}
