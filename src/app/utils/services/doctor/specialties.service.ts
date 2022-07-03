import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {
  constructor(private http: HttpClient) {}
  
  getSpecialties(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/specialties${appendQueryParams(queryParams)}`
    );
  }

  findSpecialties(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/specialties/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewSpecialties(data) {
    return this.http.post(`${doctor_url}/specialties`, data);
  }

  updateSpecialties(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/specialties/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
