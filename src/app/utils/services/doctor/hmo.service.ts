import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class HmoService {
  constructor(private http: HttpClient) {}

  getHMO(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/hmo${appendQueryParams(queryParams)}`
    );
  }

  findHMO(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/hmo/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewHMO(data) {
    return this.http.post(`${doctor_url}/hmo`, data);
  }

  updateHMO(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/hmo/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
