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
import { GraphAppComponent } from './graph-app/graph-app.component';
import { ApiListComponent } from './api-list/api-list.component';
import {MaterialModule} from '../material.module';
import { RegistrysApisComponent } from './registrys-apis/registrys-apis.component';
import { ApiReplicasComponent } from './api-replicas/api-replicas.component';
import { RegistrysApisReplicasComponent } from './registrys-apis-replicas/registrys-apis-replicas.component'
import { ChartsComponent } from 'src/app/components/charts/charts.component';
import { MetadataComponent } from './metadata/metadata.component';
import { LayoutModule } from '@angular/cdk/layout';


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
  ],
})
export class MainModule {}
