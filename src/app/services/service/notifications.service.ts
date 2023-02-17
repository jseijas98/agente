import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { NotificationType,Notification } from './notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private _subject = new Subject<Notification>();
  private _idx = 0;


  constructor() { }

  getObservable(): Observable<Notification> {
    return this._subject.asObservable();
  }

  warning(title: string, message: string, timeout = 5000) {
    this._subject.next(new Notification(this._idx++, NotificationType.warning, title, message, timeout));
  }

  error(title: string, message: string, timeout = 0) {
    this._subject.next(new Notification(this._idx++, NotificationType.error, title, message, timeout));
  }

  info(title: string, message: string, timeout = 3000) {
    this._subject.next(new Notification(this._idx++, NotificationType.info, title, message, timeout));
  }

}
