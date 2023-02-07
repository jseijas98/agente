import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutes } from './main.routing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { DiagramaComponent } from '../../components/diagrama/diagrama.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {GraphAppComponent} from './graph-app/graph-app.component';
import { ApiListComponent } from './apisM/api-list/api-list.component';
import {MaterialModule} from '../material.module';
import { RegistrysApisComponent } from './apisM/registrys-apis/registrys-apis.component';
import { ApiReplicasComponent } from './apisM/api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './apisM/registrys-apis-replicas/registrys-apis-replicas.component'
import { ChartsComponent } from 'src/app/components/charts/charts.component';
import { MetadataComponent } from './metadata/metadata.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ServicesListComponent } from './serviciosM/services-list/services-list.component';
import { ServicesRegistryComponent } from './serviciosM/services-registry/services-registry.component';
import { ServicesReplicaComponent } from './serviciosM/services-replica/services-replica.component';
import { PicListComponent } from './picM/pic-list/pic-list.component';
import { PicRegistryComponent } from './picM/pic-registry/pic-registry.component';
import { PersistenceListComponent } from './persistenceM/persistence-list/persistence-list.component';
import { PersistenceRegistryComponent } from './persistenceM/persistence-registry/persistence-registry.component';


@NgModule({
  imports: [
    MainRoutes,
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgxGraphModule,
    NgxChartsModule,
    MaterialModule,
    LayoutModule,
  ],
  declarations: [
    MainComponent,
    DashboardComponent,
    DiagramaComponent,
    GraphAppComponent,
    ApiListComponent,
    RegistrysApisComponent,
    ApiReplicasComponent,
    RegistrysApisReplicasComponent,
    ChartsComponent,
    MetadataComponent,
    ServicesListComponent,
    ServicesRegistryComponent,
    ServicesReplicaComponent,
    PicListComponent,
    PicRegistryComponent,
    PersistenceListComponent,
    PersistenceRegistryComponent
  ],
})
export class MainModule {}
