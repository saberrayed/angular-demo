import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http: HttpClient) {}
  
  getCities(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/cities${appendQueryParams(queryParams)}`
    );
  }
}
