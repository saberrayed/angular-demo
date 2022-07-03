import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mpi_url, appendQueryParams } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryService {

  constructor(private http: HttpClient) {}
  
  getAllergies(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/allergies${appendQueryParams(queryParams)}`
    );
  }
  
  saveAllergies(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/allergies${appendQueryParams(queryParams)}`, data
    );
  }

  getMedications(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/medications${appendQueryParams(queryParams)}`
    );
  }
  
  saveMedications(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/medications${appendQueryParams(queryParams)}`, data
    );
  }
  
  getMedicalHistories(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/medical-histories${appendQueryParams(queryParams)}`
    );
  }
  
  saveMedicalHistories(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/medical-histories${appendQueryParams(queryParams)}`, data
    );
  }
  
  getHospitalizationSurgery(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/hospitalization-surgeries${appendQueryParams(queryParams)}`
    );
  }
  
  saveHospitalizationSurgery(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/hospitalization-surgeries${appendQueryParams(queryParams)}`, data
    );
  }
  
  getFamilyHistories(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/family-histories${appendQueryParams(queryParams)}`
    );
  }
  
  saveFamilyHistories(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/family-histories${appendQueryParams(queryParams)}`, data
    );
  }
  
  getImmunization(queryParams = {}) {
    return this.http.get(
      `${mpi_url}/immunizations${appendQueryParams(queryParams)}`
    );
  }
  
  saveImmunization(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/immunizations${appendQueryParams(queryParams)}`, data
    );
  }
  
  getSocialHistory(patientID, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/patient/${patientID}/social-history${appendQueryParams(queryParams)}`
    );
  }
  
  saveSocialHistory(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/social-history${appendQueryParams(queryParams)}`, data
    );
  }
  
  getObgyneHistory(patientID, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/patient/${patientID}/obgyne-history${appendQueryParams(queryParams)}`
    );
  }
  
  saveObgyneHistory(patientID, data, queryParams = {}) {
    return this.http.post(
      `${mpi_url}/patient/${patientID}/obgyne-history${appendQueryParams(queryParams)}`, data
    );
  }
}
