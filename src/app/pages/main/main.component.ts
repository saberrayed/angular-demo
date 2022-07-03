import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { AppService } from 'src/app/utils/services/app.service';
import { AudioService } from 'src/app/utils/services/audio.service';
import { CallService } from '../../../../src/app/utils/services/azure/call.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { UtilitiesService } from 'src/app/utils/services/utilities/utilities.service';
import { MunicipalityService } from 'src/app/utils/services/utilities/municipality.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('contentWrapper', { static: false }) contentWrapper;

  public sidebarMenuOpened = true;
  isOnboarding: boolean = false;

  incomingCalls = [];
  initialized = false;
  pusher: any;
  user: any;
  
  constructor(
    private renderer: Renderer2,
    private appService: AppService,
    private service: ApiService,
    private utilService: UtilitiesService,
    private pusherService: PusherClientService,
    private scheduleService: ScheduleService,
    private cookieService: CookieService,
    private callService: CallService,
    private router: Router,
    private audio: AudioService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.appService.userSubject.subscribe((response: any) => {
      this.user = response;
      this.checkOnboarding();
    });

    this.user = getStorage(CURRENT_USER,true);
    this.init();
    this.getUtilities();
    this.checkOnboarding();
    // this.callService.initialize();

    this.pusherService.pusherSubject.subscribe((response: any) => {
      this.pusher = response;
      this.subscribeToChannel();
    });
  }

  checkOnboarding() {
    this.sidebarMenuOpened = +this.user?.is_new_user !== 1 ? true : false;
    this.toggleMenuSidebar();
  }

  init() {
    if(this.cookieService.get('settings.dark-mode')) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }
  }

  subscribeToChannel() {
    this.pusher.subscribe(`private-doctor-consultation-channel-${this.user?.id}`)
    ?.bind("waiting-room", (data: any) => {
      if(data?.is_auto_booking) {
        this.audio.newAppointment();
        this.incomingCalls.push(data);
      }
    });
    this.pusher.subscribe(`private-appointment-channel-${getStorage(CURRENT_USER, true)?.id}`)?.bind("patient-cancel-appointment", (data: any) => {
      const index = this.incomingCalls?.findIndex((appointment) => +appointment?.appointment_id === +data?.appointment_id);
      if(index > -1) {
        this.incomingCalls.splice(index, 1);
      }
    });
  }

  mainSidebarHeight(height) {
    // this.renderer.setStyle(
    //   this.contentWrapper.nativeElement,
    //   'min-height',
    //   height - 114 + 'px'
    // );
  }

  toggleMenuSidebar() {
    console.log('sidebarMenuCollapsed', this.sidebarMenuOpened);
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(document.body, 'sidebar-open');
      this.renderer.addClass(document.body, 'sidebar-collapse');
      this.sidebarMenuOpened = false;
    } else {
      this.renderer.removeClass(document.body, 'sidebar-collapse');
      this.renderer.addClass(document.body, 'sidebar-open');
      this.sidebarMenuOpened = true;
    }
  }
  getUtilities() {
    const includes: any[] = [
      '101', // Marital Status
      '103', // Nationality
      '104', // religion
      '158', // languages
    ];

    const queryParams: any = {};
    queryParams.perPage = 'all';
    queryParams.includes = 'details';
    queryParams.codes = includes.join(',');

    this.utilService.getValueMaster(queryParams)
    .subscribe((response: any) => {
      this.initialized = true;
      localStorage.setItem('value_master', JSON.stringify(response?.data));
    },
    (err) => {});
  }

  declineCall(data) {
    this.scheduleService.declineAppointment(data?.appointment_id, {
      decline_reason: data?.decline_reason
    })
    .subscribe((response: any) => {
      this.incomingCalls.splice(data?.index, 1);
    });
  }

  removeCall(index) {
    this.incomingCalls.splice(index, 1);
  }
}
