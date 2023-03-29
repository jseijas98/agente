import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType, Notification} from 'src/app/services/notification/notification';
import { NotificationsService } from 'src/app/services/notification/notifications.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  
  notifications: Notification[] = [];
  
  private _subscription: Subscription = new Subscription;

  constructor(private _notificationSvc: NotificationsService) { }

private _addNotification(notification: Notification) {
    this.notifications.push(notification);

    if (notification.timeout !== 0) {
      setTimeout(() => this.close(notification), notification.timeout);

    }
  }

 ngOnInit() {
    this._subscription = this._notificationSvc.getObservable().subscribe(notification => this._addNotification(notification));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  close(notification: Notification) {
    this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
  }



  className(notification: Notification): string {

    let style: string;

    switch (notification.type) {

      case NotificationType.warning:
        style = 'warning';
        break;

      case NotificationType.error:
        style = 'error';
        break;

      default:
        style = 'info';
        break;
    }

    return style;

  }
}
