import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  processing = true;
  invalid = false;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'verify-email-container');
    this.verifyEmail();
  }

  verifyEmail() {
    this.user.verifyEmail(this.route.snapshot.params.id)
    .subscribe((response: any) => {
      this.processing = false;
    }, (err) => {
      this.invalid = true;
      this.processing = false;
    })
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'verify-email-container');
    // this.authSubscription.unsubscribe();
  }

}
