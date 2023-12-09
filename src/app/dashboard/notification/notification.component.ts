import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent{

  public toastDiv: HTMLElement | null = null;

  @Input() notificationMessage!: string;
  @Input() notificationTitle!: string;
  @Input() showNotification!: boolean;

  hideToast() {
    this.showNotification = false;
  }
}
