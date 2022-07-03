import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { CasService } from './cas.service';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(
    private appService: AppService,
    private service: CasService
  ) {}

  login(user) {
    switch(user?.provider) {
        case 'GOOGLE':
            this.googleSignIn(user);
    }
  }

  async googleSignIn(user) {
    await this.service.googleSignIn(user)
    .subscribe((response: any) => {
      this.appService.storeUser(response?.user);
      this.appService.login(response?.token);
    });
  }

}
