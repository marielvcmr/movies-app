import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

// Wrong credentials also answer 401, but there the form shows the error: no logout.
const AUTH_FORM_PATHS = ['/auth/login', '/auth/register'];

// Runs on every HttpClient request (registered in main.ts):
// 1. Adds "Authorization: Bearer <token>" to calls to our API.
// 2. If the API answers 401 (expired or invalid session), logs out and goes to the login.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const navCtrl = inject(NavController);

  const token = auth.token();
  const isApiCall = req.url.startsWith(environment.apiUrl);
  const request = token && isApiCall ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((err: unknown) => {
      const isAuthForm = AUTH_FORM_PATHS.some((path) => req.url.endsWith(path));
      const sessionExpired = err instanceof HttpErrorResponse && err.status === 401 && isApiCall && !isAuthForm;
      if (sessionExpired && auth.isLoggedIn()) {
        void auth.logout().then(() => navCtrl.navigateRoot('/login'));
      }
      return throwError(() => err);
    }),
  );
};
