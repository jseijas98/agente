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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphAppComponent } from './graph-app/graph-app.component';
import { ApiListComponent } from './apisM/api-list/api-list.component';
import { MaterialModule } from '../material.module';
import { RegistrysApisComponent } from './apisM/registrys-apis/registrys-apis.component';
import { ApiReplicasComponent } from './apisM/api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './apisM/registrys-apis-replicas/registrys-apis-replicas.component';
import { ChartsComponent } from 'src/app/components/charts/charts.component';
import { MetadataComponent } from '../../components/modals/metadata/metadata.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ServicesListComponent } from './serviciosM/services-list/services-list.component';
import { ServicesRegistryComponent } from './serviciosM/services-registry/services-registry.component';
import { ServicesReplicaComponent } from './serviciosM/services-replica/services-replica.component';
import { PicListComponent } from './picM/pic-list/pic-list.component';
import { PicRegistryComponent } from './picM/pic-registry/pic-registry.component';
import { PersistenceListComponent } from './persistenceM/persistence-list/persistence-list.component';
import { PersistenceRegistryComponent } from './persistenceM/persistence-registry/persistence-registry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlowChartComponent } from 'src/app/components/flow-chart/flow-chart.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NodeFlowChartComponent } from 'src/app/components/node-flow-chart/node-flow-chart.component';
import { LoadBalancerListComponent } from './loadbalancerM/load-balancer-list/load-balancer-list.component';
import { LoadBalancerRegistryComponent } from './loadbalancerM/load-balancer-registry/load-balancer-registry.component';
import { GoBackComponent } from 'src/app/components/go-back/go-back.component';
import { ServicesRegistryReplicaComponent } from './serviciosM/services-registry-replica/services-registry-replica.component';
import { AddNewElementComponent } from 'src/app/components/modals/add-new-element/add-new-element/add-new-element.component';
import { DataFormatPipe } from 'src/app/components/pipes/data-fromat-char/data-format.pipe';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NoRegistriesComponent } from 'src/app/errors/no-registries/no-registries.component';

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
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgxGraphModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgHttpLoaderModule


  ],

  declarations: [
    MainComponent,
    DashboardComponent,
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
    PersistenceRegistryComponent,
    FlowChartComponent,
    NodeFlowChartComponent,
    LoadBalancerListComponent,
    LoadBalancerRegistryComponent,
    GoBackComponent,
    ServicesRegistryReplicaComponent,
    AddNewElementComponent,
    DataFormatPipe,
    NoRegistriesComponent
  ],
})
export class MainModule {}
