import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';

import { apiErrorMessage } from '../../api/api-error';
import { AccountEntrySelectorComponent } from '../../components/account-entry-selector/account-entry-selector.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import type { AccountMode, LoginCredentials, SignupData } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

// First screen of the app. One page for both Log in and Sign up:
// the page owns `mode`, the selector changes it, and the page shows one form or the other.
@Component({
  selector: 'app-account-entry',
  templateUrl: './account-entry.page.html',
  styleUrls: ['./account-entry.page.scss'],
  imports: [IonContent, AccountEntrySelectorComponent, LoginFormComponent, SignupFormComponent],
})
export class AccountEntryPage {
  private auth = inject(AuthService);
  private navCtrl = inject(NavController);

  mode = signal<AccountMode>('login');
  isLogin = computed(() => this.mode() === 'login');

  busy = signal(false);
  errorMessage = signal<string | null>(null);

  title = computed(() => (this.isLogin() ? 'SpoilerAlert' : 'Create your profile'));
  subtitle = computed(() =>
    this.isLogin()
      ? 'Discover your next favorite movie.'
      : 'Join to discover movies, share your reviews and see what other users think.',
  );

  constructor() {
    // The error belongs to the form that caused it: switching forms clears it.
    effect(() => {
      this.mode();
      this.errorMessage.set(null);
    });
  }

  // POST /auth/login → saves the session → Home.
  onLogin(credentials: LoginCredentials): Promise<void> {
    return this.enter(() => this.auth.login(credentials));
  }

  // POST /auth/register (always a `normal` user) → saves the session → Home.
  onSignup(data: SignupData): Promise<void> {
    return this.enter(() => this.auth.signup(data));
  }

  private async enter(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return; // ignore double taps while the request is running
    this.busy.set(true);
    this.errorMessage.set(null);
    try {
      await action();
      await this.navCtrl.navigateRoot('/tabs/home');
    } catch (err) {
      this.errorMessage.set(apiErrorMessage(err));
    } finally {
      this.busy.set(false);
    }
  }
}
