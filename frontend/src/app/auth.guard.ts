import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

// Screens that need a session. Without one, go to the login.
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.restoreSession();
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

// The login screen. With a session already open (app reopened), go straight to Home.
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.restoreSession();
  return auth.isLoggedIn() ? router.parseUrl('/tabs/home') : true;
};
