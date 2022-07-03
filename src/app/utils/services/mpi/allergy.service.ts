import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllergyService {

  allergies: any;
  allergiesSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  setallergies(allergies) {
    this.allergiesSubject.next(this.allergies = allergies);
  }
}
