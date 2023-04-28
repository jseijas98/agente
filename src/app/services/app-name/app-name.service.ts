import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, throwError } from 'rxjs';
import { Applications } from 'src/app/modules/interfaces/model.applications';
import { environment } from 'src/environments/environment';
import { SseServiceService } from '../sse/sse-service.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
@Injectable({
  providedIn: 'root',
})
export class AppNameService {
  constructor(
    private http: HttpClient,
    private sseServiceService: SseServiceService,
    private spinner: SpinnerVisibilityService

  ) {}

//se unsa en graphapp.component.ts

  getDataFromApi(index:any) {
    return this.http
      .get<any>(environment.baseUrl + 'list/applications')
      .pipe(
        switchMap((response: any) => {
          const id = index;
          const data: Array<any> = response;
          const element = data.find((x) => x.applicationId === parseInt(id));
          if (element) {
            const appName = element.applicationName;
            console.log(appName);
            return of(appName);
          } else {
            return throwError(`No se encontró una aplicación con id ${id}`);
          }
        })
      );
  }

  //se unsa en dashboards.component.ts

  getApps() {
    return this.http
      .get<any[]>(environment.baseUrl + 'list/applications')
      .pipe(
        switchMap((response: Applications[]) => {
          const data: Applications[] = response;
          const element = data.map((x) => ({
            name: x.applicationName,
            value: x.status,
            extra: x.applicationId,
          }));
          if (element) {
            const appName = element;
            // console.log(appName);
            return of(appName);
          } else {
            return throwError('error');
          }
        })
      );
  }


  public apps$:BehaviorSubject<any> = new BehaviorSubject(null);
  public appsNames$:BehaviorSubject<any> = new BehaviorSubject(null);
  // public apps$ = this.valorSunjet.asObservable();

appSee(apps:any){
  console.log(apps);
  this.apps$.next(apps)
}

appNameSee(appName:any){
  this.appsNames$.next(appName)
}

dashboard(){
    //se unsa en dashboards.component.ts

 return this.apps$.pipe(
    switchMap((response: Applications[]) => {
      const data: Applications[] = response;
      console.log('dashboard',response);
      const element = data.map((x) => ({
        name: x.applicationName,
        value: x.status,
        extra: x.applicationId,
      }));
      if (element) {

        const appName = element;
         console.log(appName);
        return of(appName);
      } else {
        return throwError('error');
      }
    })
  );
}


nameApp(index:any){
  return this.appsNames$.pipe(
    switchMap((response: any) => {
      const id = index;
      const data: Array<any> = response;
      const element = data.find((x) => x.applicationId === parseInt(id));
      if (element) {
        const appName = element.applicationName;
        console.log(appName);
        return of(appName);
      } else {
        return throwError(`No se encontró una aplicación con id ${id}`);
      }
    })
  );
}


  getAppsSse() {
     return this.sseServiceService
        .getDataFromServer2(environment.baseUrl + 'list/application').pipe(switchMap((response: Applications[]) => {
          const data: Applications[] = response;
          const element = data.map((x) => ({
            name: x.applicationName,
            value: x.status,
            extra: x.applicationId,
          }));
          if (element) {
            const appName = element;
            console.log('apps',appName);
            return of(appName);
          } else {
            return throwError('error');
          }
        })
      );
  }

  getDataFromApplication(index:any){
    return this.sseServiceService.getDataFromServer(environment.baseUrl +'list/application').pipe(
      switchMap((response: any) => {
        const id = index;
        const data: Array<any> = response;
        const element = data.find((x) => x.applicationId === parseInt(id));
        if (element) {
          const appName = element.applicationName;
          console.log(appName);
          return of(appName);
        } else {
          return throwError(`No se encontró una aplicación con id ${id}`);
        }
      })
    );
  }




}




