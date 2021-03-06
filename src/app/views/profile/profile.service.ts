import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    doctor: any;
    doctorSubject: any = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {}

    setDoctor(doctor) {
        this.doctorSubject.next(this.doctor = doctor);
    }
}
