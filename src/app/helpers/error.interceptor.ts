import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor( private router: Router,private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log({ErrorDetail: err});
      if (err.statusText == "Unknown Error") {
        console.log('Logged out');
        this.router.navigate(['sessionexpired']);

      }
      if (err.status === 401) {
        console.log('Unauthorized');
        console.log('Logged out');
        this.router.navigate(['sessionexpired']);

      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
