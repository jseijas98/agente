import { Injectable, NgZone } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import {
  Observable,
  map,
  retryWhen,
  concatMap,
  iif,
  throwError,
  of,
  delay,
  Observer,
  mergeMap,
  catchError,
  retry,
} from 'rxjs';
import { environment } from 'src/environments/environment.qa';

@Injectable({
  providedIn: 'root',
})
export class SseServiceService {
  eventSource!: EventSource;
  eventNoClose!: EventSource;

  constructor(
    private _zone: NgZone,
    private spinner: SpinnerVisibilityService
  ) {}


  private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      console.log('se cerro la conexion a:', this.eventSource.url);
      this.eventSource.close();
    }
    this.eventSource = new EventSource(url);
    console.log('se abrio la conexion a:', this.eventSource.url);
    
    return this.eventSource;
  }

  private getEventSourceNoClose(url: string): EventSource {
    this.eventNoClose = new EventSource(url);
    console.log('se abrio la conexion a:', this.eventNoClose.url);
    
    return this.eventNoClose;
  }


  public getServerSentEvent(url: string): Observable<any> {
    this.spinner.show();

    return Observable.create((observer: Observer<any>) => {
      const eventSource = (this.eventSource = this.getEventSource(url));
      
      eventSource.onopen = (event) => {
        if (eventSource.readyState == 1) {
          this.spinner.hide();
        }
      };
      eventSource.onmessage = (event) => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = (error) => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
  

  public getServerSentEventNoClose(url: string): Observable<any> {
    this.spinner.show();
    return Observable.create((observer: Observer<any>) => {
      const eventSource = (this.eventNoClose = this.getEventSourceNoClose(url));
      eventSource.onopen = (event) => {

        if (eventSource.readyState == 1) {
          this.spinner.hide();
        }

        eventSource.onmessage = (event) => {
          this._zone.run(() => {
            observer.next(event);
          });
        };

        eventSource.onerror = (error) => {
          this._zone.run(() => {
            observer.error(error);
          });
        };
      };
    });
  }

  public getDataFromServerNoClose(url: string): Observable<any> {
    return this.getServerSentEventNoClose(url).pipe(
      map((message: MessageEvent) =>message != null ? JSON.parse(message.data) : null),
      map((data: any) => data),
      retry(environment.properties.maxReconectValues),
      catchError((error) => {
        console.error('Ocurrió un error:', error);
        this.closeEventSource();
        throw new Error(
          'Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.'
        );
      })
    );
  }

  public getDataFromServer(url: string): Observable<any> {
    return this.getServerSentEvent(url).pipe(
      map((message: MessageEvent) => JSON.parse(message.data)),
      map((data: any) => data),
      retry(environment.properties.maxReconect),
      catchError((error) => {
        console.error('Ocurrió un error:', error);
        throw new Error(
          'Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.'
        );
      })
    );
  }

  public closeEventSource() {
    this.spinner.hide();
    console.log('cerrando el sse a:', this.eventSource.url);
    this.eventSource.close();
  }

}
