import { Injectable } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class EventStreamService {
  eventSource: EventSourcePolyfill;

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  getSocketEvents(): Observable<any> {
    return new Observable((observer) => {
      this.eventSource = new EventSourcePolyfill(environment.baseUrl, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('your-app@userToken'),
          'Device-Language': navigator.language,
          'Device-Name':
            this.deviceDetectorService.os +
            ' - ' +
            this.deviceDetectorService.browser +
            ' ' +
            this.deviceDetectorService.browser_version,
          'Device-OS': 'WEB',
        },
      });

      this.eventSource.onmessage = (event: any) => {
        observer.next(event.data);
      };

      this.eventSource.onerror = (error): any => {
        console.log(error);
        this.closeEventSource();
      };
    });
  }

  closeEventSource(): void {
    if (localStorage.getItem('your-app@userToken') === undefined) {
      this.eventSource.close();
    }
  }
}
