import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cas_url, appendQueryParams } from '../helper/url';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  authenticate(data, queryParams = {}) {
    return this.http.post(
        `${cas_url}/authenticate${appendQueryParams(queryParams)}`, data
    );
  }

  verify(data, queryParams = {}) {
    return this.http.post(
        `${cas_url}/verify${appendQueryParams(queryParams)}`, data
    );
  }

  logout(queryParams = {}) {
    return this.http.delete(
        `${cas_url}/logout${appendQueryParams(queryParams)}`
    );
  }

  me(queryParams = {}) {
    return this.http.get(
        `${cas_url}/me${appendQueryParams(queryParams)}`
    );
  }

  getUploadUrl() {
    return `${cas_url}/uploads/multiple`;
  }
}
