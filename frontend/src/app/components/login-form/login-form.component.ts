import { Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonInput, IonInputPasswordToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, lockClosedOutline, personOutline } from 'ionicons/icons';

import type { LoginCredentials } from '../../models/auth.model';
import { ButtonComponent } from '../button/button.component';

// Log in fields: username or email + password. It only collects the data;
// the page decides what to do with it.
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [FormsModule, IonInput, IonIcon, IonInputPasswordToggle, ButtonComponent],
})
export class LoginFormComponent {
  submitted = output<LoginCredentials>();

  login = signal('');
  password = signal('');

  // The button turns on when both fields have text.
  canSubmit = computed(() => this.login().trim().length > 0 && this.password().length > 0);

  constructor() {
    addIcons({ personOutline, lockClosedOutline, arrowForward });
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.submitted.emit({ login: this.login().trim(), password: this.password() });
  }
}
