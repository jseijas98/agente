import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiListComponent } from './modules/main/apisM/api-list/api-list.component'
import {ApiReplicasComponent} from './modules/main/apisM/api-replicas/api-replicas.component';
import {RegistrysApisReplicasComponent} from './modules/main/apisM/registrys-apis-replicas/registrys-apis-replicas.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
