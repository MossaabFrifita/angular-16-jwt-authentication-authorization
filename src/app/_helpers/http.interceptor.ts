import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpErrorResponse,
} from '@angular/common/http';
import {catchError, concatMap, map, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthService} from "../_services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.AuthenticatedUser$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return next.handle(request);
        }
        return next.handle(request).pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 403:
                  this.router.navigate(['forbidden']);
                  break;
                case 401: // handle 401 unauthorized error : try to refresh JWT
                  return this.authService.refreshToken().pipe(
                    concatMap(() => next.handle(request)),
                    catchError(err => {
                      if (err.status === 403) {
                        this.authService.logout();
                      }
                      return throwError(() => err);
                    })
                  )
              }
            }
            return throwError(() => err);
          })
        );
      })
    );
  }
}
