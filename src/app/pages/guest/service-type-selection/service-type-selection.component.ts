import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-service-type-selection',
  templateUrl: './service-type-selection.component.html',
  styleUrls: ['./service-type-selection.component.scss']
})
export class ServiceTypeSelectionComponent implements OnInit {

  patientID: any;
  serviceItems: any;
  processing = false;
  appointments: any;
  credentials: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private acsService: ACSService,
    private service: ScheduleService
  ) { }

  ngOnInit(): void {
    this.patientID = this.route.snapshot.params.patient_id;
    this.getItems();
    this.getAppointments();
  }

  getItems() {
    this.processing = true;

    this.service.getServiceItems()
    .subscribe((response: any) => {
      this.serviceItems = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  getAppointments() {
    this.service.getAppointments({
      includes: 'service.service_item',
      patient_id: this.patientID,
      perPage: 10,
      page: 1,
      order: 'appointment_start_datetime',
      sort: 'desc'
    })
    .subscribe((response: any) => {
      this.appointments = response;
    });
  }

  cancelAppointment(appointment) {
    if(confirm("Are you sure you want to cancel this appointment")) {
      appointment.cancelling = true;
      this.service.patientCancelAppointment(this.patientID, appointment?.id, {})
      .subscribe((response: any) => {
        this.toastr.success("Successfull cancelled the appointment");
        appointment.cancelling = false;
        this.getAppointments();
      }, (err) => {
        appointment.cancelling = false;
      });
    }
  }

  enterRoom(appointment) {
    appointment.loading = true;
    this.router.navigate(['/guest', this.patientID, 'waiting-room', appointment?.id]);
  }

  async updateAppointment(appointment) {
    this.credentials = await this.acsService.generateToken();

    this.service.updateAppointment(appointment?.id, {
      patient_communication_user_id: this.credentials?.user?.communicationUserId,
      patient_communication_token: this.credentials?.token,
    })
    .subscribe((response: any) => {
      this.router.navigate(['/guest', this.patientID, 'appointment', appointment?.id]);
    }, (err) => {
      appointment.loading = false;
    });
  }
}
