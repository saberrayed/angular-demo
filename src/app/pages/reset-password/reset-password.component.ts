import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  user: any;
  processing = true;
  invalid = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private service: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'login-container');
    this.verifyEmail();
  }

  createForm() {
    this.form = this.fb.group({
      new_password: [null, Validators.required],
      confirm_password: [null, [Validators.required]]
    })
  }

  verifyEmail() {
    this.service.verifyEmail(this.route.snapshot.params.id)
    .subscribe((response: any) => {
      this.processing = false;
      this.user = response;
      this.createForm();
    }, (err) => {
      this.invalid = true;
      this.processing = false;
    })
  }

  updatePassword() {
    this.processing = true;
    this.service.updatePassword(this.user?.id, this.form.value)
    .subscribe((response: any) => {
      this.toastr.success("Successfully created a new password", null, {timeOut: 3000});
      this.router.navigate(['/login']);
    }, (err) => {
      this.processing = false;
    })
  }

  getControl(name) {
    return this.form.get(name);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-container');
    // this.authSubscription.unsubscribe();
  }

}
