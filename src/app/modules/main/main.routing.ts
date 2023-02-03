import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { GraphAppComponent } from './graph-app/graph-app.component';
import { ApiListComponent } from './api-list/api-list.component';
import { ApiReplicasComponent } from './api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './registrys-apis-replicas/registrys-apis-replicas.component';
import { RegistrysApisComponent } from './registrys-apis/registrys-apis.component';
import { MetadataComponent} from './metadata/metadata.component'


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'graph-app',
        component: GraphAppComponent,
      },
      {
        path: 'apis-list',
        component: ApiListComponent,
      },{
        path: 'apis-replicas/:id',
        component: ApiReplicasComponent,
      },{
        path: 'apis-replicas-registry',
        component: RegistrysApisReplicasComponent,
      },
      {
        path: 'apis-registry/:id',
        component: RegistrysApisComponent,
      },
      {
        path: 'metadata/:ip/:parametro',
        component: MetadataComponent,
      }
      
    ],
  },
];

export const MainRoutes = RouterModule.forChild(routes);
