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
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { UpdateparamsComponent } from './components/modals/updateparams/updateparams.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNewElementFormComponent } from './components/add-new-element-form/add-new-element-form/add-new-element-form.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataFormatPipe } from './components/pipes/data-fromat-char/data-format.pipe';
import { NgHttpLoaderModule } from 'ng-http-loader';


@NgModule({
  declarations: [AppComponent, NotificationComponent, UpdateparamsComponent, AddNewElementFormComponent],
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
    NgxChartsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgHttpLoaderModule
  ],
  providers: [StringUtils],
  bootstrap: [AppComponent],
})
export class AppModule {}
