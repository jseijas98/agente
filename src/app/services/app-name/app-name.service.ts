import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppNameService {
  constructor(private http: HttpClient) {}

  name$: BehaviorSubject<any> = new BehaviorSubject(null);

  aplication(): void {
    this.http.get(environment.baseUrl + 'list/application').subscribe({
      next: this.aplicacionSuccess.bind(this),
      error: this.aplicacionError.bind(this),
    });
  }

index:any

  aplicacionSuccess(response: any): void {
    let data: Array<any> = response;
    let apps: string;

    this.name$.next(response);

    data
      .filter((x) => x.applicationId === this.index)
      .map((element) => {
        apps = element.applicationName;
        console.log(apps);
        this.name$.next(apps);
      });
  }


  aplicacionError(error: any) {
    console.error(error);
  }
}
