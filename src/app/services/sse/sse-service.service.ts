import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Observable,map,Observer,catchError, retry, switchMap} from 'rxjs';
import { environment } from 'src/environments/environment.qa';

@Injectable({
  providedIn: 'root',
})
export class SseServiceService {
  
  private eventSource!: EventSource;
  private eventNoClose!: EventSource;
  
  constructor(
    private _zone: NgZone,
    private spinner: SpinnerVisibilityService,
    private httpClient: HttpClient
    ) { }
    
    //Optimización de recursos
    private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      console.log('se cerro la conexion a:', this.eventSource.url);
      this.eventSource.close();
    }
    this.eventSource = new EventSource(url);
    console.log('se abrio la conexion a:', this.eventSource.url);

    return this.eventSource;
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

    // Función para obtener eventos SSE desde el servidor
  public getDataFromServer(url: string): Observable<any> {
    return this.getServerSentEvent(url).pipe(
      map((message: MessageEvent) => JSON.parse(message.data)),
      retry(environment.properties.maxReconect),
      catchError((error) => {
        console.error('Ocurrió un error:', error);
        throw new Error(
          'Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.'
        );
      })
    );
  }
  
     // Gestión de desconexión de SSE
     public closeEventSource() {
      this.spinner.hide();
      console.log('cerrando el sse a:', this.eventSource.url);
      this.eventSource.close();
    }
    
    // Función para enviar datos al servidor a través de una solicitud POST
  sendDataToSSEServer(url: string, postData: any): Observable<any> {
    return this.httpClient.post(url, postData);
  }

  /**
   * Establece una conexión SSE después de enviar datos al servidor a través de una solicitud POST.
   * @param body Datos a enviar en el cuerpo de la solicitud POST.
   * @returns Un Observable que emite eventos SSE desde el servidor.
   */
  connectToSSE(sseUrl: string, body:any): Observable<any> {
    return this.sendDataToSSEServer(sseUrl, body).pipe(
      switchMap(() => {
        return this.getDataFromServer(sseUrl);
      }),
      catchError((error) => {
        console.error('Error al enviar datos al servidor SSE:', error);
        throw error;
      })
    );
  }





  private getEventSourceNoClose(url: string): EventSource {
    this.eventNoClose = new EventSource(url);
    console.log('se abrio la conexion a:', this.eventNoClose.url);
    return this.eventNoClose;
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
      map((message: MessageEvent) => message != null ? JSON.parse(message.data) : null),
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

  

}
