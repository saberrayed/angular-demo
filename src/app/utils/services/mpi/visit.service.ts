import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appendQueryParams, mpi_url } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  constructor(private http: HttpClient) {}

  getVisits(queryParams = {}) {
    return this.http.get(`${mpi_url}/visits${appendQueryParams(queryParams)}`);
  }

  findVisit(visitId, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/visits/${visitId}${appendQueryParams(queryParams)}`
    );
  }

  getPayors(visitId, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/visits/${visitId}/payors${appendQueryParams(queryParams)}`
    );
  }

  currentVisit(patientId, queryParams = {}) {
    return this.http.get(
      `${mpi_url}/patients/${patientId}/open-visit${appendQueryParams(
        queryParams
      )}`
    );
  }

  updatePayor(visitId, data, queryParams = {}) {
    return this.http.put(
      `${mpi_url}/visits/${visitId}/payors${appendQueryParams(queryParams)}`,
      data
    );
  }

  lockCharges(visitId, data = {}, queryParams = {}) {
    return this.http.put(
      `${mpi_url}/visits/${visitId}/lock-charges${appendQueryParams(
        queryParams
      )}`,
      data
    );
  }

  unlockCharges(visitId, data = {}, queryParams = {}) {
    return this.http.put(
      `${mpi_url}/visits/${visitId}/unlock-charges${appendQueryParams(
        queryParams
      )}`,
      data
    );
  }
}
