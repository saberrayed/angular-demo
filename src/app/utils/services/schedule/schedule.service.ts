import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appendQueryParams, schedule_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {}

  getServiceItem(id, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/service-items${id}${appendQueryParams(queryParams)}`
    );
  }

  getService(id, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/services/${id}${appendQueryParams(queryParams)}`
    );
  }

  getAppointment(id, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/appointments/${id}${appendQueryParams(queryParams)}`
    );
  }

  getAppointments(queryParams = {}) {
    return this.http.get(
        `${schedule_url}/appointments${appendQueryParams(queryParams)}`
    );
  }

  getUpcomingAppointment(patientID, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/patient/${patientID}/upcoming-appointment${appendQueryParams(queryParams)}`
    );
  }

  getInprogressAppointment(patientID, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/patient/${patientID}/in-progress-appointment${appendQueryParams(queryParams)}`
    );
  }

  getServiceItems(queryParams = {}) {
    return this.http.get(
        `${schedule_url}/service-items${appendQueryParams(queryParams)}`
    );
  }

  getServices(queryParams = {}) {
    return this.http.get(
        `${schedule_url}/services${appendQueryParams(queryParams)}`
    );
  }

  getResources(queryParams = {}) {
    return this.http.get(
        `${schedule_url}/resources${appendQueryParams(queryParams)}`
    );
  }

  getServiceSchedules(code, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/services/${code}/schedule${appendQueryParams(queryParams)}`
    );
  }

  getAppointmentPatients(id, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/doctor/${id}/appointments/patients${appendQueryParams(queryParams)}`
    );
  }

  deletePatient(mdID, patientID, queryParams = {}) {
    return this.http.delete(
        `${schedule_url}/doctor/${mdID}/patient/${patientID}${appendQueryParams(queryParams)}`
    );
  }

  getPatientStatistics(id, serviceCode, queryParams = {}) {
    return this.http.get(
        `${schedule_url}/doctor/${id}/service/${serviceCode}/patient-statistics${appendQueryParams(queryParams)}`
    );
  }

  updateAppointment(id, data, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/appointments/${id}${appendQueryParams(queryParams)}`, data
    );
  }

  endAppointment(id, data = {}, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/end-appointment${appendQueryParams(queryParams)}`, data
    );
  }

  declineAppointment(id, data, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/appointment/${id}/decline${appendQueryParams(queryParams)}`, data
    );
  }

  patientCancelAppointment(patientID, id, data, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/patient/${patientID}/appointment/${id}/cancel${appendQueryParams(queryParams)}`, data
    );
  }

  cancelAppointment(id, data, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/appointment/${id}/cancel${appendQueryParams(queryParams)}`, data
    );
  }

  reschuduleAppointment(id, data, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/appointment/${id}/reschedule${appendQueryParams(queryParams)}`, data
    );
  }

  book(data, queryParams = {}) {
    return this.http.post(
      `${schedule_url}/book${appendQueryParams(queryParams)}`, data
    );
  }

  leaveWaitingRoom(id, data, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/leave-waiting-room${appendQueryParams(queryParams)}`, data
    );
  }

  enterWaitingRoom(id, data, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/enter-waiting-room${appendQueryParams(queryParams)}`, data
    );
  }

  doctorEnterAppointment(id, data, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/enter-appointment${appendQueryParams(queryParams)}`, data
    );
  }

  acceptPatientAppointment(id, data = {}, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/accept-patient${appendQueryParams(queryParams)}`, data
    );
  }

  missedAppointment(id, data = {}, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/appointment/${id}/missed-appointment${appendQueryParams(queryParams)}`, data
    );
  }

  getAppointmentDoctors(queryParams = {}) {
    return this.http.get(
        `${schedule_url}/appointment/doctors${appendQueryParams(queryParams)}`
    );
  }

  updateOnCallStatus(code, id, value, queryParams = {}) {
    return this.http.put(
        `${schedule_url}/service/${code}/resource/${id}/on-call/${value}${appendQueryParams(queryParams)}`, {}
    );
  }

  generateSchedule(data, queryParams = {}) {
    return this.http.post(
        `${schedule_url}/schedules/generate${appendQueryParams(queryParams)}`, data
    );
  }
  getVisits(queryParams = {}) {
    return this.http.get(`${schedule_url}/visits${appendQueryParams(queryParams)}`);
  }
}
