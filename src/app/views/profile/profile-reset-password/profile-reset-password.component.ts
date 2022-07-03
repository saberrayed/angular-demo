import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-profile-reset-password',
  templateUrl: './profile-reset-password.component.html',
  styleUrls: ['./profile-reset-password.component.scss']
})
export class ProfileResetPasswordComponent implements OnInit {

  @Output()
  back: EventEmitter<any> = new EventEmitter<any>();

  user: any;
  form: FormGroup;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user  = getStorage(CURRENT_USER, true);
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      email: [this.user?.email, Validators.required],
      password: [null, Validators.required],
      new_password: [null, Validators.required],
      confirm_password: [null, [Validators.required]]
    })
  }

  save() {
    this.processing = true;
    this.service.changePassword(this.user?.id, this.form.value)
    .subscribe((response: any) => {
      this.toastr.success(response?.message);
      this.createForm();
      this.goBack();
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  getControl(name) {
    return this.form.get(name);
  }

  goBack() {
    this.back.emit();
  }

}
