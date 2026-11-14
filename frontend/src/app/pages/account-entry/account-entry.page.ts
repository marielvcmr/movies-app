import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';

import { AccountEntrySelectorComponent } from '../../components/account-entry-selector/account-entry-selector.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import type { AccountMode, LoginCredentials, SignupData } from '../../models/auth.model';

// First screen of the app. One page for both Log in and Sign up:
// the page owns `mode`, the selector changes it, and the page shows one form or the other.
@Component({
  selector: 'app-account-entry',
  templateUrl: './account-entry.page.html',
  styleUrls: ['./account-entry.page.scss'],
  imports: [IonContent, AccountEntrySelectorComponent, LoginFormComponent, SignupFormComponent],
})
export class AccountEntryPage {
  private navCtrl = inject(NavController);

  mode = signal<AccountMode>('login');
  isLogin = computed(() => this.mode() === 'login');

  title = computed(() => (this.isLogin() ? 'SpoilerAlert' : 'Create your profile'));
  subtitle = computed(() =>
    this.isLogin()
      ? 'Discover your next favorite movie.'
      : 'Join to discover movies, share your reviews and see what other users think.',
  );

  // TODO: send the credentials to AuthService (POST /auth/login) once the API is ready.
  onLogin(credentials: LoginCredentials): void {
    void credentials;
    this.navCtrl.navigateRoot('/home');
  }

  // TODO: send the data to AuthService (POST /auth/register) once the API is ready.
  onSignup(data: SignupData): void {
    void data;
    this.navCtrl.navigateRoot('/home');
  }
}
