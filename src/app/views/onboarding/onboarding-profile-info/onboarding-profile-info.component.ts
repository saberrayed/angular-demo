import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LicensesService } from 'src/app/utils/services/doctor/licenses.service';
import { UtilitiesService } from 'src/app/utils/services/utilities/utilities.service';
import { NamesService } from 'src/app/utils/services/doctor/names.service';
import { ContactDetailService } from 'src/app/utils/services/doctor/contact-detail.service';
import { FilesService } from 'src/app/utils/services/doctor/files.service';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { OnboardingService } from 'src/app/utils/services/onboarding/onboarding.service';
import { PHYSICIAN_TYPE_CODE, PRC_TYPE_CODE, MOBILE_TYPE_CODE, EMAIL_CONTACT_TYPE, PRC_PHYSICIAN_CODE } from 'src/app/utils/items/value-set-detail';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-onboarding-profile-info',
  templateUrl: './onboarding-profile-info.component.html',
  styleUrls: ['./onboarding-profile-info.component.scss']
})
export class OnboardingProfileInfoComponent implements OnInit {

  @Input() data: any = null;

  form: FormGroup;
  user: any = null;
  doctor: any = null;
  prcID: any;
  profilePhoto: any;
  eSignature: any;
  processing = false;

  constructor(
    private router: Router,
    public nameService: NamesService,
    public licenseService: LicensesService,
    public contactDetailService: ContactDetailService,
    public utilitiesService: UtilitiesService,
    public filesService: FilesService,
    public doctorService: DoctorService,
    private userservice: UserService,
    private onboarding: OnboardingService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
    this.getDoctor();
  }

  getDoctor() {
    this.doctorService.getDoctorByUser(this.user?.id, {
      includes: 'prc_license.file,email,mobile'
    })
    .subscribe((response: any) => {
      this.doctor = response;
      this.createForm();
      this.onboarding.setDoctor(this.doctor);
    });
  }

  createForm() {
    this.form = this.fb.group({ 
      doctor: this.fb.group({
        md_id: [this.doctor?.md_id],
        date_of_birth: [this.doctor?.date_of_birth || this.user?.date_of_birth],
        user_id: [this.doctor?.user_id || this.user?.id],
        profile_photo_renamed: [this.doctor?.profile_photo_renamed],
        e_signature_renamed: [this.doctor?.e_signature_renamed, [Validators.required]],
        is_active: [0]
      }),
      name: this.fb.group({
        id: [this.doctor?.primary_name?.id],
        type_code: [this.doctor?.primary_name?.type_code || 'P'],
        type_text: [this.doctor?.primary_name?.type_text || 'Primary'],
        type_display: [this.doctor?.primary_name?.type_display || 'Primary'],
        prefix: [this.doctor?.primary_name?.prefix || this.user?.prefix],
        first: [this.doctor?.primary_name?.first || this.user?.first, [Validators.required]],
        middle: [this.doctor?.primary_name?.middle || this.user?.middle],
        last: [this.doctor?.primary_name?.last || this.user?.last, [Validators.required]],
        suffix: [this.doctor?.primary_name?.suffix || this.user?.suffix],
        degrees: [this.doctor?.primary_name?.degrees],
        is_default: [this.doctor?.primary_name?.is_default || 1],
        is_primary: [this.doctor?.primary_name?.is_primary || 1]
      }),
      license: this.fb.group({
        id: [this.doctor?.prc_license?.id],
        id_type_code: [this.doctor?.prc_license?.id_type_code || PHYSICIAN_TYPE_CODE],
        id_type_text: [this.doctor?.prc_license?.id_type_text || 'Physician'],
        id_type_display: [this.doctor?.prc_license?.id_type_display || 'Physician'],
        type_code: [this.doctor?.prc_license?.type_code || PRC_PHYSICIAN_CODE],
        type_text: [this.doctor?.prc_license?.type_text || 'PRC Physician'],
        type_display: [this.doctor?.prc_license?.type_display || 'PRC Physician'],
        number: [this.doctor?.prc_license?.number, [Validators.required]],
        issued_code: [this.doctor?.prc_license?.issued_code],
        issued_text: [this.doctor?.prc_license?.issued_text],
        issued_display: [this.doctor?.prc_license?.issued_display],
        validity_granted_datetime: [this.doctor?.prc_license?.validity_granted_datetime],
        validity_start_datetime: [this.doctor?.prc_license?.validity_start_datetime, [Validators.required]],
        validity_renewal_datetime: [this.doctor?.prc_license?.validity_renewal_datetime],
        validity_expiry_datetime: [this.doctor?.prc_license?.validity_expiry_datetime, [Validators.required]],
        validity_is_renewable: [this.doctor?.prc_license?.validity_is_renewable || 0],
        validity_is_expired: [this.doctor?.prc_license?.validity_is_expired || 0],
        status_code: [this.doctor?.prc_license?.status_code],
        status_text: [this.doctor?.prc_license?.status_text],
        status_display: [this.doctor?.prc_license?.status_display],
        notes: [this.doctor?.prc_license?.notes],
        attachment: [this.doctor?.prc_license?.attachment],
        file: this.fb.group({
          id: [this.doctor?.prc_license?.file?.id || 1],
          batch_number: [this.doctor?.prc_license?.file?.batch_number || 1],
          rename: [this.doctor?.prc_license?.file?.rename, [Validators.required]],
          name: [this.doctor?.prc_license?.file?.name, [Validators.required]],
          description: [this.doctor?.prc_license?.file?.description],
          category: [this.doctor?.prc_license?.file?.category || 'license'],
          version: [this.doctor?.prc_license?.file?.version || 1],
        })
      }),
      email: this.fb.group({
        id: [this.doctor?.email?.id],
        type_code: [this.doctor?.email?.type_code || EMAIL_CONTACT_TYPE],
        type_text: [this.doctor?.email?.type_text || 'Email Address'],
        type_display: [this.doctor?.email?.type_display || 'Email Address'],
        prefix: [this.doctor?.email?.prefix],
        value: [this.doctor?.email?.value || this.user?.email, [Validators.required]],
        is_default: [this.doctor?.email?.is_default || 1],
        is_primary: [this.doctor?.email?.is_primary || 1],
      }),
      mobile: this.fb.group({
        id: [this.doctor?.mobile?.id],
        type_code: [this.doctor?.mobile?.type_code || MOBILE_TYPE_CODE],
        type_text: [this.doctor?.mobile?.type_text || 'Mobile Phone'],
        type_display: [this.doctor?.mobile?.type_displa || 'Mobile Phone'],
        prefix: [this.doctor?.mobile?.prefix || 639],
        value: [this.doctor?.mobile?.value || this.user?.contact_no, [Validators.required, Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        is_default: [this.doctor?.mobile?.is_default || 1],
        is_primary: [this.doctor?.mobile?.is_primary || 1],
      })
    });
  }

  setImage(file, name, control) {
    this[name] = file;
    this.form.get(control).setValue(file?.preview);
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
    const promises = [];

    if(this.prcID) {
      const prcFormData = new FormData();
      prcFormData.append("file", this.prcID?.file);
      promises.push(this.doctorService.upload(prcFormData).toPromise());
    }

    if(this.profilePhoto) {
      const profileFormData = new FormData();
      profileFormData.append("file", this.profilePhoto?.file);
      promises.push(this.doctorService.upload(profileFormData).toPromise());
    }

    if(this.eSignature) {
      const signatureFormData = new FormData();
      signatureFormData.append("file", this.eSignature?.file);
      promises.push(this.doctorService.upload(signatureFormData).toPromise());
    }

    Promise.all(promises).then((responses) => {
      if(this.prcID) {
        this.form.get('license.file.rename').setValue(responses.shift());
      }
  
      if(this.profilePhoto) {
        this.form.get('doctor').patchValue({ profile_photo_renamed: responses.shift() });
      }
  
      if(this.eSignature) {
        this.form.get('doctor').patchValue({ e_signature_renamed: responses.shift() });
      }

      this.doctorService.registerProfileInformation(this.user?.id, this.form.value)
      .subscribe((response: any) => {
        this.user.doctor = response;
        localStorage.setItem(CURRENT_USER, JSON.stringify(this.user));

        // save onboarding status
        this.userservice.updateUser(this.user?.id, {
          onboarding_route: '/onboarding/credentials'
        }).subscribe();

        setTimeout(() => {
          this.router.navigate(['/onboarding/credentials']);
        }, 1);
      });
    }, (err) => {
      this.processing = false;
    });
  }

  getControl(value) {
    return this.form.get(value);
  }
}
