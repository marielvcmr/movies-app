import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import type { LoginCredentials, Session, SignupData } from '../models/auth.model';
import type { User } from '../models/user.model';

// Calls to /auth (backend/README.md → Auth). Only HTTP here: saving the session is AuthService's job.
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/auth`;

  login(credentials: LoginCredentials): Observable<Session> {
    return this.http.post<Session>(`${this.url}/login`, credentials);
  }

  register(data: SignupData): Observable<Session> {
    return this.http.post<Session>(`${this.url}/register`, data);
  }

  // The user the saved token belongs to. The interceptor adds the token.
  me(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.url}/me`).pipe(map((res) => res.user));
  }
}
