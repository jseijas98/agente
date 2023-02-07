import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { GraphAppComponent } from './graph-app/graph-app.component';
import { ApiListComponent } from './apisM/api-list/api-list.component';
import { ApiReplicasComponent } from './apisM/api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './apisM/registrys-apis-replicas/registrys-apis-replicas.component';
import { RegistrysApisComponent } from './apisM/registrys-apis/registrys-apis.component';
import { MetadataComponent } from './metadata/metadata.component';
import { ServicesListComponent } from './serviciosM/services-list/services-list.component';
import { ServicesRegistryComponent } from './serviciosM/services-registry/services-registry.component';
import { ServicesReplicaComponent } from './serviciosM/services-replica/services-replica.component';
import { PicListComponent } from './picM/pic-list/pic-list.component';
import { PicRegistryComponent } from './picM/pic-registry/pic-registry.component';
import { PersistenceListComponent } from './persistenceM/persistence-list/persistence-list.component';

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
      },
      {
        path: 'apis-replicas/:id',
        component: ApiReplicasComponent,
      },
      {
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
      },
      {
        path: 'services-list',
        component: ServicesListComponent,
      },
      {
        path: 'services-registry/:id',
        component: ServicesRegistryComponent,
      },
      {
        path: 'services-replicas/:id',
        component: ServicesReplicaComponent,
      },
      {
        path: 'pic-list',
        component: PicListComponent,
      },
      {
        path: 'pic-registry/:id',
        component: PicRegistryComponent,
      },
      {
        path: 'persistence-list',
        component: PersistenceListComponent,
      }

    ],
  },
];

export const MainRoutes = RouterModule.forChild(routes);

