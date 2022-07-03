import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-profile-change-mobile',
  templateUrl: './profile-change-mobile.component.html',
  styleUrls: ['./profile-change-mobile.component.scss']
})
export class ProfileChangeMobileComponent implements OnInit {

  @Output()
  back: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  user: any;
  form: FormGroup;
  processing = false;
  
  code: any = null;
  default: any = 1234;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      contact_no: [this.user?.contact_no, [Validators.required, Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      verification_code: []
    })
  }

  verifyNumber() {
    if(+this.code === +this.default) {
      this.save();
    }
  }

  validateCode() {
    if(this.code?.length > 3) {
      return +this.code === +this.default ? false : true;
    } else {
      return false;
    }
  }

  save() {
    this.processing = true;
    this.service.updateUser(this.user?.id, this.form.value)
    .subscribe((response: any) => {
      this.user.contact_no = this.form.value.contact_no;
      localStorage.setItem(CURRENT_USER, JSON.stringify(this.user));
      this.toastr.success("Successfull updated contact number");
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
