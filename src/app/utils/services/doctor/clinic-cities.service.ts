import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class ClinicCitiesService {
  constructor(private http: HttpClient) {}
  
  getClinicCities(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/clinic_cities${appendQueryParams(queryParams)}`
    );
  }

  findClinicCities(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/clinic_cities/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewClinicCities(data) {
    return this.http.post(`${doctor_url}/clinic_cities`, data);
  }

  updateClinicCities(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/clinic_cities/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
