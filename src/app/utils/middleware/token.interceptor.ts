import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../services/app.service';
import { TOKEN } from '../items/storage-names';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private cookieService: CookieService) {
    //
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem(TOKEN)?.split('|');

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
      }
    });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (err.error.message) {
            this.toastr.error(err.error.message, '', {
              timeOut: 2000,
            });
            this.appService.logout();
          }
        }

        if (err.status === 422 || err.status === 403 || err.status === 404 || err.status === 413)  {
          if (err.error.message) {
            this.toastr.error(err.error.message, '', {
              timeOut: 2000,
            });
          }
        }

        if (err.status === 500)  {
          if (err.error.message) {
            this.toastr.error("Something went wrong, please contact the administrator", '', {
              timeOut: 3000,
            });
          }
        }

        return throwError(err);
      })
    );
  }
}
