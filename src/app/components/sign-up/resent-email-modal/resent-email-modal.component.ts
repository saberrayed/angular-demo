import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-resent-email-modal',
  templateUrl: './resent-email-modal.component.html',
  styleUrls: ['./resent-email-modal.component.scss']
})
export class ResentEmailModalComponent implements OnInit {

  modal = false;
  processing = false;
  user: any;

  constructor(
    private service: UserService
  ) {}

  ngOnInit(): void {
  }

  resend() {
    this.processing = true;
    this.service.resentVerificationEmail(this.user?.id)
    .subscribe((response: any) => {
      this.processing = false;
    }, (err) => {
      this.processing = false;
      this.modal = false;
    });
  }

  onOpen(user) {
    this.processing = false;
    this.user = user;
    this.modal = true;
    this.resend();
  }

  onClose() {
    this.modal = false;
  }

}
