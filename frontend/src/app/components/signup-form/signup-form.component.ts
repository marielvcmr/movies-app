import { Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonInput, IonInputPasswordToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';

import type { SignupData } from '../../models/auth.model';
import { ButtonComponent } from '../button/button.component';

// Sign up fields: username, email, password and confirmation.
// It only collects the data; the page decides what to do with it.
@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [FormsModule, IonInput, IonIcon, IonInputPasswordToggle, ButtonComponent],
})
export class SignupFormComponent {
  submitted = output<SignupData>();

  username = signal('');
  email = signal('');
  password = signal('');
  confirm = signal('');

  // Show the warning only once the user starts typing the confirmation.
  mismatch = computed(() => this.confirm().length > 0 && this.confirm() !== this.password());

  canSubmit = computed(
    () =>
      this.username().trim().length > 0 &&
      this.email().indexOf('@') > 0 &&
      this.password().length > 0 &&
      this.confirm() === this.password(),
  );

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, arrowForward });
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.submitted.emit({
      username: this.username().trim(),
      email: this.email().trim().toLowerCase(),
      password: this.password(),
    });
  }
}
