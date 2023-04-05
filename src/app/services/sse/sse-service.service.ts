import { Injectable, NgZone } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Observable, map, retryWhen, concatMap, iif, throwError, of, delay, Observer } from 'rxjs';
import { environment } from 'src/environments/environment.qa';

@Injectable({
  providedIn: 'root'
})
export class SseServiceService {

  eventSource!:EventSource;

  constructor(private _zone:NgZone,
    private spinner: SpinnerVisibilityService) { }

  public getDataFromServer(url: string):Observable<any>{
    return this.getServerSentEvent(url).pipe(
      map((message:MessageEvent) => message != null ? JSON.parse(message.data) : null),
      map((data:any) => data),
      retryWhen(errors => errors.pipe(
        concatMap((e, i) =>
        iif(
          () => i == environment.properties.maxReconectValues,
          throwError(e),
          of(e).pipe(delay(5000))
        ))
      )),
    );
  }

  public getServerSentEvent(url:string):Observable<any>{
    this.spinner.show();

    return Observable.create((observer: Observer<any>) => {
      const eventSource = this.eventSource = this.getEventSource(url);

      eventSource.onopen = (event) => { if(eventSource.readyState == 1) this.spinner.hide(); };

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSource(url);
    return this.eventSource;
  }

  public closeEventSource(url:string){
    this.eventSource.close();
  }


}
