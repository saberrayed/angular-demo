import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-consult-now',
  templateUrl: './consult-now.component.html',
  styleUrls: ['./consult-now.component.scss']
})
export class ConsultNowComponent implements OnInit {

  patientID: any;
  serviceCode: any;
  services: any;
  processing = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ScheduleService
  ) { }

  ngOnInit(): void {
    this.patientID = this.route.snapshot.params.patient_id;
    this.getServices();
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

  book(service) {
    this.toastr.success("Successfully booked");
    this.router.navigate([service?.id]);
    // this.service.consultNow({
    //   patient_id: this.patientID,
    //   service_id: service?.id,
    //   resource_id: this,
    //   complaint: ,
    // })
    // .subscribe((response: any) => {
    //   this
    // });
  }
}
