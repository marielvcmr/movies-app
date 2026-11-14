import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // First screen: Log in and Sign up share this page (see the selector).
    path: 'login',
    loadComponent: () => import('./pages/account-entry/account-entry.page').then((m) => m.AccountEntryPage),
  },
  {
    // Template page, temporary until the real Home (/tabs/home) exists.
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
