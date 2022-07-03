import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appendQueryParams, cas_url } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(data, queryParams = {}) {
    return this.http.post(
      `${cas_url}/users/register${appendQueryParams(queryParams)}`, data
    );
  }
  
  verifyMobile(id, data, queryParams = {}) {
    return this.http.post(
      `${cas_url}/users/${id}/verify-mobile${appendQueryParams(queryParams)}`, data
    );
  }
  
  verifyEmail(id, data = {}, queryParams = {}) {
    return this.http.post(
      `${cas_url}/users/${id}/verify-email${appendQueryParams(queryParams)}`, data
    );
  }
  
  resentVerificationEmail(id, data = {}, queryParams = {}) {
    return this.http.post(
      `${cas_url}/users/${id}/resend-verification-email${appendQueryParams(queryParams)}`, data
    );
  }
  
  updateUser(id, data = {}, queryParams = {}) {
    return this.http.put(
      `${cas_url}/users/${id}${appendQueryParams(queryParams)}`, data
    );
  }
  
  resetPassword(email, data = {}, queryParams = {}) {
    return this.http.post(
        `${cas_url}/users/${email}/reset-password${appendQueryParams(queryParams)}`, data
    );
  }
  
  changePassword(id, data = {}, queryParams = {}) {
    return this.http.put(
        `${cas_url}/user/${id}/change-password${appendQueryParams(queryParams)}`, data
    );
  }
  
  updatePassword(id, data = {}, queryParams = {}) {
    return this.http.post(
        `${cas_url}/users/${id}/update-password${appendQueryParams(queryParams)}`, data
    );
  }
  
  agreeServiceAgreement(id, data = {}, queryParams = {}) {
    return this.http.put(
      `${cas_url}/users/${id}/agree-service-contract${appendQueryParams(queryParams)}`, data
    );
  }
}
