import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CredentialsComponent } from 'src/app/components/onboarding/credentials/credentials.component';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { PTR_LICENSE_CODE, S2_LICENSE_CODE } from 'src/app/utils/items/value-set-detail';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-credentials',
  templateUrl: './profile-credentials.component.html',
  styleUrls: ['./profile-credentials.component.scss']
})
export class ProfileCredentialsComponent implements OnInit {

  @ViewChild('credentials', {static: false})
  credentials: CredentialsComponent;

  doctor: any;
  user: any;
  loading = true;
  processing = false;
  form: any;

  s2License: any;
  ptrLicense: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.profileService.doctorSubject.subscribe((response: any) => {
      if(response) {
        this.doctor = response;
        this.loading = false;
        this.createForm();
        setTimeout(() => {
          this.credentials.setDoctor(response);
        }, 1);
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      s2_license: this.fb.group({
        id: [this.doctor?.s2_license?.id],
        id_type_code: [this.doctor?.s2_license?.id_type_code],
        id_type_text: [this.doctor?.s2_license?.id_type_text],
        id_type_display: [this.doctor?.s2_license?.id_type_display],
        type_code: [this.doctor?.s2_license?.type_code || S2_LICENSE_CODE],
        type_text: [this.doctor?.s2_license?.type_text || 'S2 License'],
        type_display: [this.doctor?.s2_license?.type_display || 'S2 License'],
        number: [this.doctor?.s2_license?.number],
        issued_code: [this.doctor?.s2_license?.issued_code],
        issued_text: [this.doctor?.s2_license?.issued_text],
        issued_display: [this.doctor?.s2_license?.issued_display],
        validity_granted_datetime: [this.doctor?.s2_license?.validity_granted_datetime],
        validity_start_datetime: [this.doctor?.s2_license?.validity_start_datetime],
        validity_renewal_datetime: [this.doctor?.s2_license?.validity_renewal_datetime],
        validity_expiry_datetime: [this.doctor?.s2_license?.validity_expiry_datetime],
        validity_is_renewable: [this.doctor?.s2_license?.validity_is_renewable || 0],
        validity_is_expired: [this.doctor?.s2_license?.validity_is_expired || 0],
        status_code: [this.doctor?.s2_license?.status_code],
        status_text: [this.doctor?.s2_license?.status_text],
        status_display: [this.doctor?.s2_license?.status_display],
        notes: [this.doctor?.s2_license?.notes],
        attachment: [this.doctor?.s2_license?.attachment],
        file: this.fb.group({
          id: [this.doctor?.s2_license?.file?.id || 1],
          batch_number: [this.doctor?.s2_license?.file?.batch_number || 1],
          rename: [this.doctor?.s2_license?.file?.rename],
          name: [this.doctor?.s2_license?.file?.name],
          description: [this.doctor?.s2_license?.file?.description],
          category: [this.doctor?.s2_license?.file?.category || 'license'],
          version: [this.doctor?.s2_license?.file?.version || 1],
        })
      }),
      ptr_license: this.fb.group({
        id: [this.doctor?.ptr_license?.id],
        id_type_code: [this.doctor?.ptr_license?.id_type_code],
        id_type_text: [this.doctor?.ptr_license?.id_type_text],
        id_type_display: [this.doctor?.ptr_license?.id_type_display],
        type_code: [this.doctor?.ptr_license?.type_code || PTR_LICENSE_CODE],
        type_text: [this.doctor?.ptr_license?.type_text || 'PTR'],
        type_display: [this.doctor?.ptr_license?.type_display || 'PTR'],
        number: [this.doctor?.ptr_license?.number],
        issued_code: [this.doctor?.ptr_license?.issued_code],
        issued_text: [this.doctor?.ptr_license?.issued_text],
        issued_display: [this.doctor?.ptr_license?.issued_display],
        validity_granted_datetime: [this.doctor?.ptr_license?.validity_granted_datetime],
        validity_start_datetime: [this.doctor?.ptr_license?.validity_start_datetime],
        validity_renewal_datetime: [this.doctor?.ptr_license?.validity_renewal_datetime],
        validity_expiry_datetime: [this.doctor?.ptr_license?.validity_expiry_datetime],
        validity_is_renewable: [this.doctor?.ptr_license?.validity_is_renewable || 0],
        validity_is_expired: [this.doctor?.ptr_license?.validity_is_expired || 0],
        status_code: [this.doctor?.ptr_license?.status_code],
        status_text: [this.doctor?.ptr_license?.status_text],
        status_display: [this.doctor?.ptr_license?.status_display],
        notes: [this.doctor?.ptr_license?.notes],
        attachment: [this.doctor?.ptr_license?.attachment],
        file: this.fb.group({
          id: [this.doctor?.ptr_license?.file?.id || 1],
          batch_number: [this.doctor?.ptr_license?.file?.batch_number || 1],
          rename: [this.doctor?.ptr_license?.file?.rename],
          name: [this.doctor?.ptr_license?.file?.name],
          description: [this.doctor?.ptr_license?.file?.description],
          category: [this.doctor?.ptr_license?.file?.category || 'license'],
          version: [this.doctor?.ptr_license?.file?.version || 1],
        })
      })
    });
  }

  setImageControl(file, name, control) {
    this[name] = file;
    this.form.get(control).patchValue({
      name: file?.file?.name,
      rename: file?.preview
    });
  }

  save() {
    this.processing = true;

    const credentials = this.credentials.form.value;
    const licenses = this.form.value;
    const data: any = Object.assign({},credentials,licenses);
    const promises = [];

    if(this.s2License) {
      const prcFormData = new FormData();
      prcFormData.append("file", this.s2License?.file);
      promises.push(this.doctorService.upload(prcFormData).toPromise());
    }

    if(this.ptrLicense) {
      const prcFormData = new FormData();
      prcFormData.append("file", this.ptrLicense?.file);
      promises.push(this.doctorService.upload(prcFormData).toPromise());
    }

    Promise.all(promises).then((responses) => {
      
      if(this.s2License) {
        data.s2_license.file.rename = responses.shift();
      }

      if(this.ptrLicense) {
        data.ptr_license.file.rename = responses.shift();
      }

      this.doctorService.registerCredentails(this.user?.id, data)
      .subscribe((response: any) => {
        this.processing = false;
        this.toastr.success("Successfully updated your credentials");
      }, (err) => {
        this.processing = false;
      });
    });
  }

  back() {
    this.router.navigate(['/home']);
  }
}
