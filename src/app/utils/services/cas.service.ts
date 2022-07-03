import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api_url, appendQueryParams, cas_url } from '../helper/url';

@Injectable({
  providedIn: 'root'
})
export class CasService {

  constructor(private http: HttpClient) {}

  authenticate(data, queryParams = {}) {
    return this.http.post(
        `${cas_url}/authenticate${appendQueryParams(queryParams)}`, data
    );
  }

  googleSignIn(data, queryParams = {}) {
    return this.http.post(
        `${cas_url}/google/sign-in${appendQueryParams(queryParams)}`, data
    );
  }
  
  updateUser(id, data = {}, queryParams = {}) {
    return this.http.put(
        `${cas_url}/users/${id}${appendQueryParams(queryParams)}`, data
    );
  }

  logout(tokenId, queryParams = {}) {
    return this.http.delete(
        `${cas_url}/logout/${tokenId}${appendQueryParams(queryParams)}`
    );
  }
}
