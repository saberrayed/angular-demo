import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-book-consultation',
  templateUrl: './book-consultation.component.html',
  styleUrls: ['./book-consultation.component.scss']
})
export class BookConsultationComponent implements OnInit {

  patientID: any;
  serviceCode: any;
  services: any;
  selectedService: any;
  processing = false;
  searching = false;
  schedule: any;
  selectedSlot: any;
  form: any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ScheduleService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.patientID = this.route.snapshot.params.patient_id;
    this.serviceCode = this.route.snapshot.params.code;
    this.getService();
  }

  createForm() {
    const moment = extendMoment(_moment);
    
    this.form = this.fb.group({
      patient_id: this.route.snapshot.params.patient_id,
      service_id: this.route.snapshot.params.service_id,
      resource_id: this.selectedService?.resource_id,
      slot_id: null,
      complaint: [null, Validators.required],
      date: [moment().format('YYYY-MM-DD'), Validators.required]
    });
  }

  getService() {
    this.service.getService(this.route.snapshot.params.service_id, {includes: 'resource'})
    .subscribe((response: any) => {
      this.selectedService = response;
      this.createForm();

      this.getServiceSchedule();
    });
  }

  getServiceSchedule() {
    this.searching = true;
    this.form.get('slot_id').setValue(null);
    this.service.getServiceSchedules(this.serviceCode, {
      date: this.form?.value?.date,
      resource_id: this.selectedService?.resource_id
    })
    .subscribe((response: any) => {
      this.searching = false;
      this.schedule = response;
    }, (err) => {
      this.searching = false;
    })
  }

  getServices() {
    this.processing = true;

    this.service.getServices({
      service_item_code: this.serviceCode = this.route.snapshot.params.code,
      includes: 'resource,current_slot'
    })
    .subscribe((response: any) => {
      this.services = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  updateSlot(id) {
    this.form.get('slot_id').setValue(id);
  }

  book() {
    this.processing = true;

    this.service.book(this.form.value)
    .subscribe((response: any) => {
      this.processing = false;
      this.toastr.success("Successfully booked");

      if(this.selectedService?.is_auto_booking) {
        this.router.navigate(['/guest', this.patientID, 'waiting-room', response?.id]);
      } else {
        this.router.navigate(['/guest', this.patientID]);
      }
    }, (err) => {
      this.processing = false;
    });
  }
}
