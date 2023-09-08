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

 ngOnInit() {
  }

}
