import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class HmoMastersService {
  constructor(private http: HttpClient) {}

  getHMOMasters(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/hmo_masters${appendQueryParams(queryParams)}`
    );
  }

  findHMOMasters(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/hmo_masters/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewHMOMasters(data) {
    return this.http.post(`${doctor_url}/hmo_masters`, data);
  }

  updateHMOMasters(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/hmo_masters/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
