import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, utilities_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {
  constructor(private http: HttpClient) {}

  getMunicipality(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/municipalities${appendQueryParams(queryParams)}`
    );
  }

  findMunicipality(id, queryParams = {}) {
    return this.http.get(
        `${utilities_url}/municipalities/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewMunicipality(data) {
    return this.http.post(`${utilities_url}/municipalities`, data);
  }

  updateMunicipality(id, data, queryParams = {}) {
    return this.http.put(
        `${utilities_url}/municipalities/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }
  getCountries(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/countries${appendQueryParams(queryParams)}`
    );
  }

  getProvinces(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/provinces${appendQueryParams(queryParams)}`
    );
  }

  getBarangay(queryParams = {}) {
    return this.http.get(
      `${utilities_url}/barangay${appendQueryParams(queryParams)}`
    );
  }
}
