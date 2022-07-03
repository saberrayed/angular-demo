import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyMastersService {
  constructor(private http: HttpClient) {}

  getSpecialtyMasters(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/specialty_masters${appendQueryParams(queryParams)}`
    );
  }

  findSpecialtyMasters(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/specialty_masters/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewSpecialtyMasters(data) {
    return this.http.post(`${doctor_url}/specialty_masters`, data);
  }

  updateSpecialtyMasters(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/specialty_masters/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
