import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class HospitalMastersService {
  constructor(private http: HttpClient) {}
  
  getHospitalMasters(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/hospital_masters${appendQueryParams(queryParams)}`
    );
  }

  findHospitalMasters(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/hospital_masters/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewHospitalMasters(data) {
    return this.http.post(`${doctor_url}/hospital_masters`, data);
  }

  updateHospitalMasters(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/hospital_masters/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
