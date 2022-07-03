import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CURRENT_USER } from '../items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';

@Injectable({
  providedIn: 'root'
})
export class NewUserGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (+getStorage(CURRENT_USER,true)?.is_new_user === 1) {
        this.router.navigate([getStorage(CURRENT_USER,true)?.onboarding_route]);
        return false;
      }
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
