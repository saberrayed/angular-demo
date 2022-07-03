import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  doctor: any;
  user: any;
  patients: any;
  appointments: any;
  processing = false;

  
  constructor(
    private service: ScheduleService
   
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.getNewPatientCount();
    this.getConsultsCount();
  }

  getNewPatientCount(){
    this.service.getAppointmentPatients(getStorage(CURRENT_USER, true)?.doctor?.md_id)
    .subscribe((response: any) => {
      this.patients = response.data;
    }, (err) => {
      this.processing = false;
    })
  }

  getConsultsCount(){
    this.service.getAppointments()
    .subscribe((response: any) => {
      this.processing = false;
      this.appointments = response.data;
    }, (err) => {
      this.processing = false;
    });
  }


}
