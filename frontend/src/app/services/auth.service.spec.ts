import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

import { environment } from '../../environments/environment';
import { authInterceptor } from '../api/auth.interceptor';
import type { User } from '../models/user.model';

import { AuthService } from './auth.service';

const USER: User = {
  _id: 'u1',
  username: 'ana',
  email: 'ana@mail.com',
  type: 'normal',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

// Lets pending promises (Preferences, firstValueFrom) move on.
const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

describe('AuthService + authInterceptor', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  const navStub = { navigateRoot: vi.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    await Preferences.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: NavController, useValue: navStub },
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('logs in, saves the token and knows the user', async () => {
    const done = auth.login({ login: 'ana', password: 'secret123' });
    const req = http.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.body).toEqual({ login: 'ana', password: 'secret123' });
    req.flush({ token: 'jwt-1', user: USER });
    await done;

    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.user()?.username).toBe('ana');
    expect((await Preferences.get({ key: 'spoileralert.token' })).value).toBe('jwt-1');
  });

  it('restores a saved session with GET /auth/me, sending the token', async () => {
    await Preferences.set({ key: 'spoileralert.token', value: 'jwt-saved' });

    const done = auth.restoreSession();
    await flushPromises();
    const req = http.expectOne(`${environment.apiUrl}/auth/me`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-saved');
    req.flush({ user: USER });
    await done;

    expect(auth.isLoggedIn()).toBe(true);
  });

  it('forgets an expired token', async () => {
    await Preferences.set({ key: 'spoileralert.token', value: 'jwt-old' });

    const done = auth.restoreSession();
    await flushPromises();
    http
      .expectOne(`${environment.apiUrl}/auth/me`)
      .flush(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
        { status: 401, statusText: 'Unauthorized' },
      );
    await done;

    expect(auth.isLoggedIn()).toBe(false);
    expect((await Preferences.get({ key: 'spoileralert.token' })).value).toBeNull();
  });

  it('a wrong password does not log out or navigate', async () => {
    const done = auth.login({ login: 'ana', password: 'wrong' });
    http
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid login or password' } },
        { status: 401, statusText: 'Unauthorized' },
      );

    await expect(done).rejects.toMatchObject({ status: 401 });
    expect(navStub.navigateRoot).not.toHaveBeenCalled();
  });
});
