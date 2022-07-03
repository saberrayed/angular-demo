import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class LicensesService {
  constructor(private http: HttpClient) {}

  getLicense(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/licenses${appendQueryParams(queryParams)}`
    );
  }

  findLicense(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/licenses/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewLicense(data) {
    return this.http.post(`${doctor_url}/licenses`, data);
  }

  updateLicense(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/licenses/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }

  storeFileSingle(data) {
    return this.http.post(`${doctor_url}/licenses/store-file-single`, data);
  }

  storeFileMultiple(data) {
    return this.http.post(`${doctor_url}/licenses/store-file-multiple`, data);
  }
}
