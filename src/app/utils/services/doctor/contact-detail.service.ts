import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailService {
  constructor(private http: HttpClient) {}

  getContactDetail(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/contact_details${appendQueryParams(queryParams)}`
    );
  }

  findContactDetail(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/contact_details/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewContactDetail(data) {
    return this.http.post(`${doctor_url}/contact_details`, data);
  }

  updateContactDetail(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/contact_details/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
