import { environment } from "../../../environments/environment"

export const api_url = environment.cas_url + environment.cas_ver;
export const cas_url = environment.cas_url + environment.cas_ver;
export const mpi_url = environment.mpi_url + environment.mpi_ver;
export const doctor_url = environment.doctor_url + environment.doctor_ver;
export const utilities_url = environment.utilities_url + environment.utilities_ver;
export const schedule_url = environment.schedule_url + environment.schedule_ver;
export const forms_url = environment.forms_url + environment.forms_ver;

export function appendQueryParams(queryParams) {
    let params: string = '';
    for (const key of Object.keys(queryParams)) {
      if (queryParams[key]) {
        params = params + (params ? '&' : '?') + `${key}=${queryParams[key]}`;
      }
    }
    return params;
}
  
export function appendFilterParams(source, queryParams) {
    for (const key of Object.keys(queryParams)) {
      if (queryParams[key] && queryParams[key] !== 'null') {
        source[key] = queryParams[key];
      }
    }
}