import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  constructor(private http: HttpClient) {}
  
  getHospital(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/hospital${appendQueryParams(queryParams)}`
    );
  }

  findHospital(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/hospital/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewHospital(data) {
    return this.http.post(`${doctor_url}/hospital`, data);
  }

  updateHospital(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/hospital/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
