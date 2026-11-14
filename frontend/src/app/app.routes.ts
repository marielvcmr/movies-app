import type { Routes } from '@angular/router';

import { adminGuard } from './admin.guard';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  {
    // First screen: Log in and Sign up share this page (see the selector).
    // With a session already open, guestGuard skips it and goes to Home.
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/account-entry/account-entry.page').then((m) => m.AccountEntryPage),
  },
  {
    // Screens with the bottom tab bar. TabsPage is the frame; the children load inside it.
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/users/users.page').then((m) => m.UsersPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    // Details of a movie or series. Outside the tabs: no tab bar, back button instead.
    path: 'programs/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/program-detail/program-detail.page').then((m) => m.ProgramDetailPage),
  },
  {
    // authGuard sends people without a session to /login.
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
