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
import { FlowChartNodeComponent } from './components/flow-chart-node/flow-chart-node.component';



@NgModule({
  declarations: [AppComponent, FlowChartNodeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    LoginModule,
    MainModule,
    MaterialModule,
  ],
  providers: [StringUtils],
  bootstrap: [AppComponent],
})
export class AppModule {}
