import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DoctorService } from '../doctor/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

    doctor: any;
    doctorSubject = new BehaviorSubject<any>(null);

    constructor(
        private service: DoctorService
    ) {}

    setDoctor(doctor) {
        this.doctorSubject.next(this.doctor = doctor);
    }

    getDoctor(userID, queryParams = {}) {
        this.service.getDoctorByUser(userID, queryParams)
        .subscribe((response: any) => {
            this.setDoctor(response);
        })
    }

}
