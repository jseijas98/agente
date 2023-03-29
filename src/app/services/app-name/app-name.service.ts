import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, switchMap, throwError } from 'rxjs';
import { Applications } from 'src/app/modules/interfaces/model.applications';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AppNameService {
  constructor(private http: HttpClient) {}

  getDataFromApi(index: any) {
    return this.http.get<any>(environment.baseUrl + 'list/application').pipe(
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

  getApps() {
    return this.http.get<Applications[]>(environment.baseUrl + 'list/application').pipe(
      switchMap((response:Applications[]) => {
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
}
