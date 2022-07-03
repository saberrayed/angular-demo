import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NamesService } from 'src/app/utils/services/doctor/names.service';
import { AppService } from 'src/app/utils/services/app.service';
import { UserService } from 'src/app/utils/services/cas/users.service';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { LicensesService } from 'src/app/utils/services/doctor/licenses.service';
import { FilesService } from 'src/app/utils/services/doctor/files.service';
import { UtilitiesService } from 'src/app/utils/services/utilities/utilities.service';
import { ToastrService } from 'ngx-toastr';
import { PRC_TYPE_CODE, PHYSICIAN_TYPE_CODE, EMAIL_CONTACT_TYPE, MOBILE_TYPE_CODE, PRC_PHYSICIAN_CODE } from 'src/app/utils/items/value-set-detail';
import { getMasterByName } from 'src/app/utils/helper/utilities';
import { sex } from 'src/app/utils/items/sex';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { MedicalDocumentsUploadComponent } from 'src/app/components/uploader/medical-documents-upload/medical-documents-upload.component';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  
  @ViewChild('medicalDocument', {static: false})
  medicalDocument: MedicalDocumentsUploadComponent;

  @Input()
  doctor: any;

  form: FormGroup;
  processing = false;
  loading = true;
  user: any = null;
  prcID: any;
  profilePhoto: any;
  eSignature: any;
  sexList = sex;
  languageSpoken: any = null;
  selectedLanguages: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppService,
    private doctorService: DoctorService,
    private toastr: ToastrService,
    private profileService: ProfileService,
    private fileService: FilesService
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
    this.languageSpoken = getMasterByName('Languages');
    
    this.profileService.doctorSubject.subscribe((response: any) => {
      if(response) {
        this.doctor = response;
        this.selectedLanguages = this.user?.languages_spoken?.split(',');
        this.loading = false;

        setTimeout(() => {
          this.createForm();
          setTimeout(() => {
            this.setMedicalDocuments();
          }, 1);
        }, 1);
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      doctor: this.fb.group({
        md_id: [this.doctor?.md_id],
        date_of_birth: [this.doctor?.date_of_birth],
        profile_photo_renamed: [this.doctor?.profile_photo_renamed],
        sex_code: [this.doctor?.sex_code],
        e_signature_renamed: [this.doctor?.e_signature_renamed, [Validators.required]]
      }),
      user: this.fb.group({
        languages_spoken: [],
      }),
      name: this.fb.group({
        id: [this.doctor?.primary_name?.id],
        type_code: [this.doctor?.primary_name?.type_code || 'P'],
        type_text: [this.doctor?.primary_name?.type_text || 'Primary'],
        type_display: [this.doctor?.primary_name?.type_display || 'Primary'],
        prefix: [this.doctor?.primary_name?.prefix],
        first: [this.doctor?.primary_name?.first, [Validators.required]],
        middle: [this.doctor?.primary_name?.middle],
        last: [this.doctor?.primary_name?.last, [Validators.required]],
        suffix: [this.doctor?.primary_name?.suffix],
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
      medical_documents: this.fb.array([])
    });
  }

  setMedicalDocuments() {
    this.medicalDocument.files = [];
    this.doctor.medical_documents.forEach((document) => {
      document.isUploaded = true;
      this.medicalDocument.files.push(document);
    });
  }

  save() {

    this.processing = true;
    const data = Object.assign({},this.form.value);
    data.medical_documents = [];
    data.user.languages_spoken = this.selectedLanguages?.join(',');
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

    this.medicalDocument.files.forEach((item) => {
      if(item?.file && !item?.isUploaded) {
        const formData = new FormData();
        formData.append("file", item?.file);
        promises.push(this.doctorService.upload(formData).toPromise());
      }
    });

    Promise.all(promises).then((responses) => {
      if(this.prcID) {
        data.license.file.rename = responses.shift();
      }
  
      if(this.profilePhoto) {
        data.doctor.profile_photo_renamed = responses.shift();
      }
  
      if(this.eSignature) {
        data.doctor.e_signature_renamed = responses.shift()
      }

      this.medicalDocument.files.forEach((item) => {
        if(item?.file && !item?.isUploaded) {
          item.rename = responses.shift();
          data.medical_documents.push(item);
        }
        item.isUploaded = true;
      });

      this.medicalDocument.toDelete.forEach((file) => {
        if(file?.id) {
          this.fileService.deleteFile(file?.id).subscribe();
        }
      });

      this.doctorService.registerProfileInformation(this.user?.id, data)
      .subscribe((response: any) => {
        this.user.languages_spoken = data?.user?.languages_spoken;
        this.user.doctor.primary_name = response?.primary_name;
        this.user.doctor.profile_photo_renamed = response?.profile_photo_renamed;
        this.user.doctor.profile_photo_url = response?.profile_photo_url;
        localStorage.setItem(CURRENT_USER, JSON.stringify(this.user));

        this.appService.setUser(this.user);
        this.medicalDocument.toDelete = [];

        this.processing = false;
        this.toastr.success("Successfully updated your information");

      }, (err) => {
        this.processing = false;
      });
    }, (err) => {
      this.processing = false;
    });
  }

  getControl(value) {
    return this.form.get(value);
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

  back() {
    this.router.navigate(['/home']);
  }

}
