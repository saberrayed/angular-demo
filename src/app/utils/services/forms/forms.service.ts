import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appendQueryParams, forms_url } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private http: HttpClient) {}

  getDocumentTemplates(queryParams = {}) {
    return this.http.get(
      `${forms_url}/document-templates${appendQueryParams(queryParams)}`,
      {}
    );
  }

  getDocumentTypes(queryParams = {}) {
    return this.http.get(
      `${forms_url}/document-types${appendQueryParams(queryParams)}`
    );
  }

  getDocumentCategories(queryParams = {}) {
    return this.http.get(
      `${forms_url}/document-categories${appendQueryParams(queryParams)}`
    );
  }

  getDocument(id, queryParams = {}) {
    return this.http.get(
      `${forms_url}/documents/${id}${appendQueryParams(queryParams)}`
    );
  }

  getDocuments(queryParams = {}) {
    return this.http.get(
      `${forms_url}/documents${appendQueryParams(queryParams)}`
    );
  }

  getDocumentTemplate(code: number, queryParams = {}) {
    return this.http.get(
      `${forms_url}/document-templates/${code}${appendQueryParams(queryParams)}`
    );
  }

  storeDocument(data = {}, queryParams = {}) {
    return this.http.post(
      `${forms_url}/documents${appendQueryParams(queryParams)}`,
      data
    );
  }

  storeDocumentRevision(id, data = {}, queryParams = {}) {
    return this.http.post(
      `${forms_url}/documents/${id}/revisions${appendQueryParams(queryParams)}`,
      data
    );
  }

  storeDocumentApprovers(id, data = {}, queryParams = {}) {
    return this.http.post(
      `${forms_url}/documents/${id}/approvers${appendQueryParams(queryParams)}`,
      data
    );
  }

  updateDocument(id, data, queryParams = {}) {
    return this.http.put(
      `${forms_url}/documents/${id}${appendQueryParams(queryParams)}`,
      data
    );
  }

  deleteDocument(id, queryParams = {}) {
    return this.http.delete(
      `${forms_url}/documents/${id}${appendQueryParams(queryParams)}`
    );
  }

  generatePDF(id, pdfID, data = {}, queryParams = {}) {
    return this.http.post(
      `${forms_url}/documents/${id}/pdf/${pdfID}${appendQueryParams(
        queryParams
      )}`,
      data,
      {
        headers: {
          'Content-Type': 'application/octet-stream,application/json',
        },
        responseType: 'blob',
      }
    );
  }

  sendDocument(id, data = {}, queryParams = {}) {
    return this.http.post(
      `${forms_url}/send-document/${id}${appendQueryParams(queryParams)}`, data
    );
  }

  getPatientPrescriptions(id, queryParams = {}) {
    return this.http.get(
      `${forms_url}/patient/${id}/prescriptions${appendQueryParams(queryParams)}`
    );
  }

  getFiles(queryParams = {}) {
    return this.http.get(
      `${forms_url}/files${appendQueryParams(queryParams)}`
    );
  }

  saveFile(data, queryParams = {}) {
    return this.http.post(
      `${forms_url}/files${appendQueryParams(queryParams)}`, data
    );
  }

  deleteFile(id, queryParams = {}) {
    return this.http.delete(
      `${forms_url}/file/${id}${appendQueryParams(queryParams)}`
    );
  }

  downloadFile(id, queryParams = {}) {
    return this.http.get(
      `${forms_url}/file/${id}/download${appendQueryParams(queryParams)}`, {
        responseType: 'blob'
      }
    );
  }

  upload(data) {
    const reqOpts = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
    return this.http.post(`${forms_url}/upload`, data, reqOpts);
  }
}
