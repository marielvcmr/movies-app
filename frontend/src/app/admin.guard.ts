import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

// Users module: admins only. Anyone else goes back to Home.
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.restoreSession();
  return auth.isAdmin() ? true : router.parseUrl('/tabs/home');
};
