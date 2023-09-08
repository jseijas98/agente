import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { GraphAppComponent } from './graph-app/graph-app.component';
import { ApiListComponent } from './apisM/api-list/api-list.component';
import { ApiReplicasComponent } from './apisM/api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './apisM/registrys-apis-replicas/registrys-apis-replicas.component';
import { RegistrysApisComponent } from './apisM/registrys-apis/registrys-apis.component';
import { MetadataComponent } from '../../components/modals/metadata/metadata.component';
import { ServicesListComponent } from './serviciosM/services-list/services-list.component';
import { ServicesRegistryComponent } from './serviciosM/services-registry/services-registry.component';
import { ServicesReplicaComponent } from './serviciosM/services-replica/services-replica.component';
import { PicListComponent } from './picM/pic-list/pic-list.component';
import { PicRegistryComponent } from './picM/pic-registry/pic-registry.component';
import { PersistenceListComponent } from './persistenceM/persistence-list/persistence-list.component';
import { ServicesRegistryReplicaComponent } from './serviciosM/services-registry-replica/services-registry-replica.component';
import { PersistenceRegistryComponent } from './persistenceM/persistence-registry/persistence-registry.component';
import { LoadBalancerListComponent } from './loadbalancerM/load-balancer-list/load-balancer-list.component';
import { LoadBalancerRegistryComponent } from './loadbalancerM/load-balancer-registry/load-balancer-registry.component';
import { ServicesDetailsComponent } from './serviciosM/services-details/services-details.component';
import { ApisDetailsComponent } from './apisM/apis-details/apis-details.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'graph-app/:id',
        component: GraphAppComponent,
      },
      {
        path: 'apis-list/:id',
        component: ApiListComponent,
      },
      {
        path: 'apis-replicas/:id',
        component: ApiReplicasComponent,
      },
      {
        path: 'apis-replicas-registry/:id/:ip',
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
        path: 'services-list/:id',
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
        path: 'pic-list/:id',
        component: PicListComponent,
      },
      {
        path: 'pic-registry/:id',
        component: PicRegistryComponent,
      },
      {
        path: 'persistence-list/:id',
        component: PersistenceListComponent,
      },
      {
        path: 'persistence-registry/:id',
        component: PersistenceRegistryComponent,
      },
      {
        path: 'services-replicas-registry/:id/:ip',
        component: ServicesRegistryReplicaComponent,
      },
      {
        path: 'loadBalancer-list/:id',
        component: LoadBalancerListComponent,
      },
      {
        path: 'loadBalancer-registry/:id',
        component: LoadBalancerRegistryComponent,
      },
      {
        path: 'servicesDetails/:id',
        component: ServicesDetailsComponent,
      },
      {
        path: 'apisDetails/:id',
        component: ApisDetailsComponent,
      },
    ],
  },
];

export const MainRoutes = RouterModule.forChild(routes);
