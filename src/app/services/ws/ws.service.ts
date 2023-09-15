import { Injectable, NgZone } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { retry, catchError, Subject, Observable, map } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor(private _zone: NgZone, private spinner: SpinnerVisibilityService) { }

  private socket$: Subject<any>;
  private socketNoClose$: Subject<any>;


  public connectToWebSocket(url: string,body:any, onDataReceived?: (data: any) => void): Observable<any> {
    this.spinner.show();
    this.socket$ = webSocket(url);
    this.socket$.next(body);
      console.log("BODY",body);

    this.socket$.pipe(
      retry(environment.properties.maxReconectValues),
      catchError((error) => {
        console.error('Ocurrió un error:', error);
        this.closeWebSocket();
        throw new Error(
          'Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.'
        );
      })
    ).subscribe((data) => {
      console.log("DATA",data);
      
      this._zone.run(() => {
        if (onDataReceived) {
          this.spinner.hide();
          onDataReceived(data);
        }
      });
    }, (error) => {
      this._zone.run(() => {
        console.error('Ocurrió un error en la conexión WebSocket:', error);
        this.spinner.hide();
        this.closeWebSocket();
        throw new Error(
          'Se produjo un error inesperado en la conexión WebSocket. Por favor, inténtalo de nuevo más tarde.'
        );
      });
    }, () => {
      this.closeWebSocket();
    });
    return this.socket$;
  }

  // http://180.183.170.56:30446/monitor-agent-service/v2/get/all

  getdata() {
    this.connectToWebSocket('URL_DEL_SERVIDOR',{value:1}).subscribe({
      next: this.dataSuccess.bind(this),
      error: this.dataError.bind(this),
      complete: () => console.log('completed'),
    });
  }

  dataError(response:any){
    console.log(response);
    
  }
  dataSuccess(error:any){
    console.log(error);
    
  }


  public closeWebSocket(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

}
