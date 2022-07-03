import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, doctor_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(private http: HttpClient) {}

  getFile(queryParams = {}) {
    return this.http.get(
      `${doctor_url}/files${appendQueryParams(queryParams)}`
    );
  }

  findFile(id, queryParams = {}) {
    return this.http.get(
        `${doctor_url}/files/${id}${appendQueryParams(queryParams)}`
    );
  }

  saveNewFile(data) {
    return this.http.post(`${doctor_url}/files`, data);
  }

  updateFile(id, data, queryParams = {}) {
    return this.http.put(
        `${doctor_url}/files/${id}/update${appendQueryParams(queryParams)}`, data
    );
  }

  deleteFile(id, queryParams = {}) {
    return this.http.delete(
        `${doctor_url}/files/${id}${appendQueryParams(queryParams)}`
    );
  }
}
