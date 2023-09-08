import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, switchMap, throwError } from 'rxjs';
import { Applications } from 'src/app/modules/interfaces/model.applications';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AppNameService {
  constructor(
    private http: HttpClient,
  ) { }

  public apps$: BehaviorSubject<any> = new BehaviorSubject(null);

  //se unsa en graphapp.component.ts

  getDataFromApi(index: any) {
    return this.http.get<any>(environment.baseUrl + 'list/applications').pipe(
      map((response: any) => {
        // Validar que response no sea nulo y sea un arreglo
        if (!response || !Array.isArray(response)) {
          throw new Error('La respuesta no es válida o está vacía');
        }
        
        const id = index;
        // Validar que index sea un número válido
        if (isNaN(id) || id < 0) {
          throw new Error('El índice no es válido');
        }
        
        const element = response.find((x) => x.applicationId === parseInt(id));
        // Validar que element no sea nulo y contenga un nombre de aplicación válido
        if (!element || typeof element.applicationName !== 'string' || element.applicationName.trim() === '') {
          throw new Error(`No se encontró una aplicación válida con id ${id}`);
        }
  
        const appName = element.applicationName;
        console.log(appName);
        return appName;
      }),
      catchError((error: any) => {
        // Puedes realizar acciones específicas aquí, como registrar el error o proporcionar un valor por defecto
        console.error('Error en getDataFromApi:', error.message);
        return of('Nombre de aplicación no encontrado');
      })
    );
  }
  
  //se usa en dashboards.component.ts
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

  appSee(apps: any) {
    if (apps) {
      console.log("appSee", apps);
      const sortedApps = apps.sort((a: any, b: any) => a.status - b.status);
      this.apps$.next(sortedApps);
    }
  }

  dashboard() {
    return this.apps$.pipe(
      switchMap((response: Applications[]) => {

        const data: Applications[] = response;

        if (data) {
          const element = data.map((x) => ({
            name: x.applicationName,
            value: x.status,
            extra: x.applicationId,
          }));
          const appName = element;
          console.log("app names:", appName);
          return of(appName);
        } else {
          return of([]);
        }
      })
    );
  }

  nameApp(index: any) {
    return this.apps$.pipe(
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




