import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { CURRENT_USER, TOKEN } from '../items/storage-names';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  user: any;
  userSubject: any = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private socialAuthService: SocialAuthService,
  ) {}

  setUser(user) {
    this.userSubject.next(this.user = user);
  }

  login(token) {
    localStorage.setItem(TOKEN, token);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    // this.socialAuthService.signOut(true);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(CURRENT_USER);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1);
  }

  storeUser(user) {
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
  }
}
