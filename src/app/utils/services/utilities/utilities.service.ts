import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, utilities_url } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(private http: HttpClient) {}

  getValueMaster(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/masters${appendQueryParams(queryParams)}`
    );
  }

  findValueMaster(id, queryParams = {}) {
    return this.http.get(
        `${utilities_url}/masters/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewValueMaster(data) {
    return this.http.post(`${utilities_url}/masters`, data);
  }

  updateValueMaster(id, data, queryParams = {}) {
    return this.http.put(
        `${utilities_url}/masters/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }

  getValueDetail(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/details${appendQueryParams(queryParams)}`
    );
  }

  findValueDetail(id, queryParams = {}) {
    return this.http.get(
        `${utilities_url}/details/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewValueDetail(data) {
    return this.http.post(`${utilities_url}/details`, data);
  }

  updateValueDetail(id, data, queryParams = {}) {
    return this.http.put(
        `${utilities_url}/details/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }

}
