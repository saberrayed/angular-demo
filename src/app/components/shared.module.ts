import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { SkeletonTableLoadingComponent } from './skeleton-table-loading/skeleton-table-loading.component';
import { UploadFileComponent } from './upload/upload.component';
import { NotificationsDropdownMenuComponent } from './notifications-dropdown-menu/notifications-dropdown-menu.component';
import { MessagesDropdownMenuComponent } from './messages-dropdown-menu/messages-dropdown-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientBannerComponent } from './patient/patient-banner/patient-banner.component';
import { PatientProfileComponent } from './patient/patient-profile/patient-profile.component';
import { ClinicalDocumentFormComponent } from './clinical/clinical-document-form/clinical-document-form.component';
import { ClinicalDocumentFormTemplateComponent } from './clinical/clinical-document-form-template/clinical-document-form-template.component';
import { ClinicalDocumentFilterComponent } from './clinical/clinical-document-filter/clinical-document-filter.component';
import { ClinicalDocumentTextTemplateComponent } from './clinical/clinical-document-text-template/clinical-document-text-template.component';
import { ClinicalDocumentUploaderComponent } from './clinical/clinical-document-uploader/clinical-document-uploader.component';
import { ClinicalDocumentCreateModalComponent } from './clinical/clinical-document-create-modal/clinical-document-create-modal.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ClinicalDocumentSelectModalComponent } from './clinical/clinical-document-select-modal/clinical-document-select-modal.component';
import { ClinicalDocumentListTemplateComponent } from './clinical/clinical-document-list-template/clinical-document-list-template.component';
import { ClinicalDocumentSignModalComponent } from './clinical/clinical-document-sign-modal/clinical-document-sign-modal.component';
import { VitalSignsComponent } from './clinical/microservices/vital-signs/vital-signs.component';
import { ChartsModule } from 'ng2-charts';
import { ClinicalDocumentHtmlViewerComponent } from './clinical/clinical-document-html-viewer/clinical-document-html-viewer.component';
import { SafeHtmlPipe } from '../utils/pipes/sanitize.pipe';
import { VideoCallComponent } from './video-call/video-call.component';
import { PrivacyPolicyComponent } from './sign-up/privacy-policy/privacy-policy.component';
import { SignUpFormComponent } from './sign-up/sign-up-form/sign-up-form.component';
import { PasswordModule } from 'primeng/password';
import { SmsVerificationFormComponent } from './sign-up/sms-verification-form/sms-verification-form.component';
import { VerifyEmailNoticeComponent } from './sign-up/verify-email-notice/verify-email-notice.component';
import { DidntReceiveCodeModalComponent } from './sign-up/didnt-receive-code-modal/didnt-receive-code-modal.component';
import { DidntReceiveEmailModalComponent } from './sign-up/didnt-receive-email-modal/didnt-receive-email-modal.component';
import { ResentEmailModalComponent } from './sign-up/resent-email-modal/resent-email-modal.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { DelinePatientModalComponent } from './calling/deline-patient-modal/deline-patient-modal.component';
import { EndConsultationModalComponent } from './calling/end-consultation-modal/end-consultation-modal.component';
import { EndVideoCallModalComponent } from './calling/end-video-call-modal/end-video-call-modal.component';
import { IncomingCallComponent } from './calling/incoming-call/incoming-call.component';
import { TimerComponent } from './timer/timer.component';
import { VideoCallGuestComponent } from './video-call-guest/video-call-guest.component';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoDefaultFormatter, TimeagoClock } from 'ngx-timeago';
import { TimeagoClockInterval } from '../utils/custom-package/time-ago.clock';
import { CancelAppointmentModalComponent } from './appointments/cancel-appointment-modal/cancel-appointment-modal.component';
import { RescheduleAppointmentModalComponent } from './appointments/reschedule-appointment-modal/reschedule-appointment-modal.component';
import { FileUploadComponent } from './uploader/file-upload/file-upload.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CredentialsComponent } from './onboarding/credentials/credentials.component';
import { MedicalDocumentsUploadComponent } from './uploader/medical-documents-upload/medical-documents-upload.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { RegistrationComponent } from './patient/registration/registration.component';
import { ContactsComponent } from './patient/contacts/contacts.component';
import { DemographicsComponent } from './patient/demographics/demographics.component';
import { EmergencyContactsComponent } from './patient/emergency-contacts/emergency-contacts.component';
import { FamilyDetailsComponent } from './patient/family-details/family-details.component';
import { IdentificationComponent } from './patient/identification/identification.component';
import { OccupationComponent } from './patient/occupation/occupation.component';
import { AddressesComponent } from './patient/addresses/addresses.component';
import { CreateAppointmentModalComponent } from './appointments/create-appointment-modal/create-appointment-modal.component';
import { AllergiesComponent } from './medical-history/allergies/allergies.component';
import { MedicationHistoryComponent } from './medical-history/medication-history/medication-history.component';
import { PastMedicalHistoryComponent } from './medical-history/past-medical-history/past-medical-history.component';
import { PastHospitalizationHistoryComponent } from './medical-history/past-hospitalization-history/past-hospitalization-history.component';
import { FamilyMedicalHistoryComponent } from './medical-history/family-medical-history/family-medical-history.component';
import { PersonalSocialHistoryComponent } from './medical-history/personal-social-history/personal-social-history.component';
import { ImmunizationHistoryComponent } from './medical-history/immunization-history/immunization-history.component';
import { ObgyneHistoryComponent } from './medical-history/obgyne-history/obgyne-history.component';
import { AllergyModalComponent } from './patient/allergy-modal/allergy-modal.component';
import { DocumentUploaderComponent } from './uploader/document-uploader/document-uploader.component';
import { ChipsModule } from 'primeng/chips';
import { ClinicalPrescriptionHistoryModalComponent } from './clinical/buttons/clinical-prescription-history-modal/clinical-prescription-history-modal.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MenuSidebarComponent,
    SkeletonTableLoadingComponent,
    UploadFileComponent,
    NotificationsDropdownMenuComponent,
    MessagesDropdownMenuComponent,
    PatientBannerComponent,
    PatientProfileComponent,
    ClinicalDocumentFormComponent,
    ClinicalDocumentFormTemplateComponent,
    ClinicalDocumentFilterComponent,
    ClinicalDocumentTextTemplateComponent,
    ClinicalDocumentUploaderComponent,
    ClinicalDocumentCreateModalComponent,
    ClinicalDocumentSelectModalComponent,
    ClinicalDocumentListTemplateComponent,
    ClinicalDocumentSignModalComponent,
    VitalSignsComponent,
    ClinicalDocumentHtmlViewerComponent,
    SafeHtmlPipe,
    VideoCallComponent,
    PrivacyPolicyComponent,
    SignUpFormComponent,
    SmsVerificationFormComponent,
    VerifyEmailNoticeComponent,
    DidntReceiveCodeModalComponent,
    DidntReceiveEmailModalComponent,
    ResentEmailModalComponent,
    IncomingCallComponent,
    TimerComponent,
    EndVideoCallModalComponent,
    EndConsultationModalComponent,
    DelinePatientModalComponent,
    VideoCallGuestComponent,
    CancelAppointmentModalComponent,
    RescheduleAppointmentModalComponent,
    FileUploadComponent,
    AutocompleteComponent,
    CredentialsComponent,
    MedicalDocumentsUploadComponent,
    RegistrationComponent,
    ContactsComponent,
    DemographicsComponent,
    EmergencyContactsComponent,
    FamilyDetailsComponent,
    IdentificationComponent,
    OccupationComponent,
    AddressesComponent,
    CreateAppointmentModalComponent,
    AllergiesComponent,
    MedicationHistoryComponent,
    PastMedicalHistoryComponent,
    PastHospitalizationHistoryComponent,
    FamilyMedicalHistoryComponent,
    PersonalSocialHistoryComponent,
    ImmunizationHistoryComponent,
    ObgyneHistoryComponent,
    AllergyModalComponent,
    DocumentUploaderComponent,
    ClinicalPrescriptionHistoryModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AccordionModule,
    FileUploadModule,
    DialogModule,
    EditorModule,
    SkeletonModule,
    AutoCompleteModule,
    CheckboxModule,
    NgxPaginationModule,
    ChartsModule,
    PasswordModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RippleModule,
    ChipsModule,
    InputSwitchModule,
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoDefaultFormatter },
      clock: {provide: TimeagoClock, useClass: TimeagoClockInterval},
    }),
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MenuSidebarComponent,
    SkeletonTableLoadingComponent,
    UploadFileComponent,
    NotificationsDropdownMenuComponent,
    MessagesDropdownMenuComponent,
    PatientBannerComponent,
    PatientProfileComponent,
    ClinicalDocumentFormComponent,
    ClinicalDocumentFormTemplateComponent,
    ClinicalDocumentFilterComponent,
    ClinicalDocumentTextTemplateComponent,
    ClinicalDocumentUploaderComponent,
    ClinicalDocumentCreateModalComponent,
    ClinicalDocumentSelectModalComponent,
    ClinicalDocumentListTemplateComponent,
    ClinicalDocumentSignModalComponent,
    VideoCallComponent,
    VideoCallComponent,
    PrivacyPolicyComponent,
    SignUpFormComponent,
    SmsVerificationFormComponent,
    VerifyEmailNoticeComponent,
    TimerComponent,
    IncomingCallComponent,
    EndVideoCallModalComponent,
    EndConsultationModalComponent,
    DelinePatientModalComponent,
    VideoCallGuestComponent,
    CancelAppointmentModalComponent,
    RescheduleAppointmentModalComponent,
    FileUploadComponent,
    AutocompleteComponent,
    CredentialsComponent,
    MedicalDocumentsUploadComponent,
    DidntReceiveCodeModalComponent,
    RegistrationComponent,
    CreateAppointmentModalComponent,
    AllergiesComponent,
    MedicationHistoryComponent,
    PastMedicalHistoryComponent,
    PastHospitalizationHistoryComponent,
    FamilyMedicalHistoryComponent,
    PersonalSocialHistoryComponent,
    ImmunizationHistoryComponent,
    ObgyneHistoryComponent,
    DocumentUploaderComponent
  ]
})
export class SharedModule { }
