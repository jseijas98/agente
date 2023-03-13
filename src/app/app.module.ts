import { MainModule } from './modules/main/main.module';
import { LoginModule } from './modules/login/login.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material.module';
import StringUtils from './common/util/stringUtils';
import { NotificationComponent } from './components/notification/notification.component';
import { NodeFlowChartComponent } from './components/node-flow-chart/node-flow-chart.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { UpdateparamsComponent } from './components/modals/updateparams/updateparams.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoBackComponent } from './components/go-back/go-back.component';

@NgModule({
  declarations: [AppComponent, NotificationComponent, UpdateparamsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    LoginModule,
    MainModule,
    MaterialModule,
    NgxGraphModule,
    ReactiveFormsModule
    
  ],
  providers: [StringUtils],
  bootstrap: [AppComponent],
})
export class AppModule {}
