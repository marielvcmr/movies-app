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
        loadComponent: () => import('./pages/my-profile/my-profile.page').then((m) => m.MyProfilePage),
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
    // Public profile of another user, opened from their reviews. Outside the tabs, like Details.
    path: 'users/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-profile/user-profile.page').then((m) => m.UserProfilePage),
  },
  {
    // authGuard sends people without a session to /login.
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
