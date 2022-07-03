import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  Renderer2
} from '@angular/core';
import { Router } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { AudioService } from 'src/app/utils/services/audio.service';
import { NotificationService } from 'src/app/utils/services/cas/notifications.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';

@Component({
  selector: 'app-notifications-dropdown-menu',
  templateUrl: './notifications-dropdown-menu.component.html',
  styleUrls: ['./notifications-dropdown-menu.component.scss']
})
export class NotificationsDropdownMenuComponent implements OnInit {

  @ViewChild('dropdownMenu', { static: false }) dropdownMenu: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hideDropdownMenu();
    }
  }

  page = 1;
  perPage = 10;
  pusher: any;
  processing = false;
  notifications: any = [];
  unreadCount = 0;
  total = 0;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private pusherService: PusherClientService,
    private audioService: AudioService,
    private service: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getNotifications();
    this.getUnreadNotificationCount();

    this.pusherService.pusherSubject.subscribe((response: any) => {
      this.pusher = response;
      this.subscribeToNotification();
    });
  }

  scroll(element) {
    if((+element?.target?.scrollHeight - +element?.target?.scrollTop) >= (element?.target?.clientHeight - 20)) {
      if(+this.notifications?.length < +this.total) {
        this.getNotifications(this.page + 1);
      }
    }
  }

  getNotifications(page = 1) {
    if(!this.processing) {
      this.processing = true;
      this.service.getNotifications(getStorage(CURRENT_USER, true)?.id, {
        perPage: this.perPage,
        page: this.page = page
      }).subscribe((response: any) => {
        this.processing = false;
        this.total = response?.total;
        response?.data?.forEach((notification) => {
          notification.date = new Date(notification?.created_at).getTime();
          this.notifications.push(notification);
        });
      }, (err) => {
        this.processing = false;
      });
    }
  }

  getUnreadNotificationCount() {
    this.processing = true;
    this.service.userUnreadCount(getStorage(CURRENT_USER, true)?.id)
    .subscribe((response: any) => {
      this.unreadCount = response;
    }, (err) => {
      this.processing = false;
    });
  }

  markAsRead(notification) {
    if(!notification.read_at) {
      this.unreadCount--;
      notification.read_at = new Date();
      this.service.markAsRead(getStorage(CURRENT_USER, true)?.id, notification?.id)
      .subscribe((response: any) => {});
    }
  }

  unreadNotifications() {
    return this.notifications?.filter((notif) => !notif.read_at);
  }

  next() {
    this.getNotifications(this.page + 1);
  }

  subscribeToNotification() {
    this.pusher.subscribe("private-user-notification-channel-" + getStorage(CURRENT_USER, true)?.id)
    .bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (data) => {
      data.date = new Date(data?.created_at).getTime();
      this.notifications.unshift(data);
      this.audioService.notify();
      this.unreadCount++;
    });
  }

  toggleDropdownMenu() {
    if (this.dropdownMenu.nativeElement.classList.contains('show')) {
      this.hideDropdownMenu();
    } else {
      this.showDropdownMenu();
    }
  }

  showDropdownMenu() {
    this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
  }

  hideDropdownMenu() {
    this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
  }

  navigate(notification) {
    if(notification?.data?.query) {
      return this.router.navigate([notification?.data?.path], { queryParams: notification?.data?.query });
    } else {
      return this.router.navigate([notification?.data?.path]);
    }
  }

  convert(text) {
    return text ? JSON.parse(text) : null;
  }
}
