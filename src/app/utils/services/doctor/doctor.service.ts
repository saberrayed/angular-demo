import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appendQueryParams, doctor_url, schedule_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) {}
  
  getDoctors(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/doctors${appendQueryParams(queryParams)}`
    );
  }

  getDoctor(mdID, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/doctors/${mdID}${appendQueryParams(queryParams)}`
    );
  }

  getDoctorByUser(userID, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/doctors/user/${userID}${appendQueryParams(queryParams)}`
    );
  }

  saveDoctor(data) {
    return this.http.post(`${doctor_url}/doctors`, data);
  }

  updateDoctor(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/doctors/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }

  registerProfileInformation(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/doctors/${id}/profile-information${appendQueryParams(queryParams)}`, data
    );
  }

  registerCredentails(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/doctors/${id}/credentials${appendQueryParams(queryParams)}`, data
    );
  }

  registerVirtualClinic(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/doctors/${id}/virtual-clinic${appendQueryParams(queryParams)}`, data
    );
  }

  upload(data) {
    const reqOpts = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
    return this.http.post(`${doctor_url}/file/upload`, data, reqOpts);
  }
}
