import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitService } from 'src/app/utils/services/mpi/visit.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-visit-history',
  templateUrl: './visit-history.component.html',
  styleUrls: ['./visit-history.component.scss']
})
export class VisitHistoryComponent implements OnInit {

  patient: any;
  patientID: any;
  visitHistory: any;
  processing = true;

  constructor(
    private route: ActivatedRoute,
    private service: ScheduleService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    this.patientID = this.route.parent.snapshot.params.patient_id;

    this.getVisitHistory();
  }

  getVisitHistory() {
    const queryParams: any = {};
    queryParams.patient_id = this.patientID;
    queryParams.sort = 'desc';
    queryParams.order = 'admission_datetime';
    queryParams.includes = 'clinic,appointment.service.service_item';

    this.service.getVisits(queryParams).subscribe((response : any) => {
      this.visitHistory = response?.data;
      this.processing = false;
      this.visitHistory.push({ patient_class_code: 'START' });
    }, (err) => {
      this.processing = false;
    })  
  }

  getAttribute(visit, array, column) {
    return visit?.[array].find((s) => s[column]);
  }

  counter(val) {
    return new Array(val);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }
}
