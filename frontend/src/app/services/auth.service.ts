import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';

import { AuthApi } from '../api/auth.api';
import { UsersApi } from '../api/users.api';
import type { LoginCredentials, Session, SignupData } from '../models/auth.model';
import type { ProfileChanges, User } from '../models/user.model';
import { UserType } from '../models/user.model';

// Where the JWT is saved on the phone (Preferences = localStorage in the browser).
const TOKEN_KEY = 'spoileralert.token';

// The session: who is logged in and their token, as signals every screen can read.
// Pages call login / signup / logout; guards call restoreSession; the interceptor reads token().
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApi);
  private usersApi = inject(UsersApi);

  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<User | null>(null);
  private restoring: Promise<void> | null = null;

  // Read-only from outside: only this service changes the session.
  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.type === UserType.ADMIN);

  // When the app opens: if a token was saved, ask the API whose it is (GET /auth/me).
  // Runs only once; the guards await it before deciding where to go.
  restoreSession(): Promise<void> {
    this.restoring ??= this.restore();
    return this.restoring;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.start(await firstValueFrom(this.api.login(credentials)));
  }

  async signup(data: SignupData): Promise<void> {
    await this.start(await firstValueFrom(this.api.register(data)));
  }

  // PATCH /users/me (Edit profile). The new username / email shows everywhere at once,
  // because every screen reads them from user().
  async updateProfile(changes: ProfileChanges): Promise<void> {
    this.userSignal.set(await firstValueFrom(this.usersApi.updateMe(changes)));
  }

  // DELETE /users/me, then the same as logout. If the API fails, the session stays open.
  async deleteAccount(): Promise<void> {
    await firstValueFrom(this.usersApi.deleteMe(), { defaultValue: undefined });
    await this.logout();
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private async start(session: Session): Promise<void> {
    await Preferences.set({ key: TOKEN_KEY, value: session.token });
    this.tokenSignal.set(session.token);
    this.userSignal.set(session.user);
    this.restoring = Promise.resolve(); // nothing left to restore
  }

  private async restore(): Promise<void> {
    const { value: token } = await Preferences.get({ key: TOKEN_KEY });
    if (!token) return;

    this.tokenSignal.set(token);
    try {
      this.userSignal.set(await firstValueFrom(this.api.me()));
    } catch (err) {
      // 401 = expired token or deleted account: forget it. Any other error (API off,
      // no network) keeps the token, so the session comes back next time the app opens.
      if (err instanceof HttpErrorResponse && err.status === 401) {
        await this.logout();
      } else {
        this.tokenSignal.set(null);
      }
    }
  }
}
