import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(private http: HttpClient) {}
  
  getClinic(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/clinics${appendQueryParams(queryParams)}`
    );
  }

  findClinic(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/clinics/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewClinic(data) {
    return this.http.post(`${doctor_url}/clinics`, data);
  }

  updateClinic(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/clinics/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
