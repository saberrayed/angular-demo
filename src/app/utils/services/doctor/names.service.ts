import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class NamesService {

  constructor(private http: HttpClient) {}

  getNames(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/names${appendQueryParams(queryParams)}`
    );
  }

  findName(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/names/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewName(data) {
    return this.http.post(`${doctor_url}/names`, data);
  }

  updateName(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/names/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
}
