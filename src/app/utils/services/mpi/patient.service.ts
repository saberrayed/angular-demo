import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mpi_url, appendQueryParams } from '../../helper/url';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  patient: any;
  patientSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  listPatient(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/patients${appendQueryParams(queryParams)}`
    );
  }

  findPatient(patientId, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/patients/${patientId}${appendQueryParams(queryParams)}`
    );
  }

  update(patientId, data, queryParams = {}) {
    return this.http.put(`${mpi_url}/patients/${patientId}${appendQueryParams(queryParams)}`, data);
  }

  updatePatient(patientId, data, queryParams = {}) {
    return this.http.put(`${mpi_url}/patients/${patientId}/update-info${appendQueryParams(queryParams)}`, data);
  }

  registerPatient(data, queryParams = {}) {
    return this.http.post(`${mpi_url}/patients/register${appendQueryParams(queryParams)}`, data);
  }

  updateRegistration(id, data, queryParams = {}) {
    return this.http.put(`${mpi_url}/patients/${id}/update-registration${appendQueryParams(queryParams)}`, data);
  }

  getUploadUrl() {
    return `${mpi_url}/uploads`;
  }

  getUploadMutlipleUrl() {
    return `${mpi_url}/uploads/multiple`;
  }

  setPatient(patient) {
    this.patientSubject.next(this.patient = patient);
  }
}
