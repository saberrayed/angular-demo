import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER, ON_CALL, TOKEN } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { AppService } from 'src/app/utils/services/app.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();

  public searchForm: FormGroup;

  user: any;
  darkMode = false;
  currentDate: any;

  constructor(
    private appService: AppService,
    private apiService: ApiService,
    private service: ScheduleService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.appService.userSubject.subscribe((response: any) => {
      this.user = response;
    });
    this.user = getStorage(CURRENT_USER,true);
    this.darkMode = this.cookieService.get('settings.dark-mode') ? true : false;
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  toggleOnCall(toggle, event) {
    this.service.updateOnCallStatus(toggle.service_item_code, toggle?.resource_id, event.checked ? 1 : 0)
    .subscribe();
    localStorage.setItem(CURRENT_USER, JSON.stringify(this.user));
  }

  logout() {   
    this.apiService.logout()
    .subscribe((response: any) => {
      this.router.navigate(['/logout']);
    },(err) => {
    });
  }
}
