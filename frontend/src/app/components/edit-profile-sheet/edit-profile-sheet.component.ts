import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonModal,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, lockClosedOutline, mailOutline, personOutline, shieldOutline } from 'ionicons/icons';

import { USER_TYPE_LABELS } from '../../constants/labels';
import type { ProfileChanges, User } from '../../models/user.model';
import { ButtonComponent } from '../button/button.component';

// "Edit profile" popup (a bottom sheet, like Filters and Write a review), opened from My profile.
// Username, email and, optionally, a new password with confirmation. The type is shown but
// only an admin can change it. Inside, the user edits a copy; nothing is sent until "Save changes".
// It doesn't call the API: it emits only the fields that changed and the page saves them.
// <app-edit-profile-sheet [isOpen]="open" [user]="user" [busy]="saving" [error]="err"
//                         (submitted)="save($event)" (closed)="open = false" />
@Component({
  selector: 'app-edit-profile-sheet',
  templateUrl: './edit-profile-sheet.component.html',
  styleUrls: ['./edit-profile-sheet.component.scss'],
  imports: [
    FormsModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonIcon,
    IonInput,
    IonInputPasswordToggle,
    ButtonComponent,
  ],
})
export class EditProfileSheetComponent {
  isOpen = input(false);
  user = input.required<User>();
  busy = input(false);
  error = input<string | null>(null);

  submitted = output<ProfileChanges>();
  closed = output<void>();

  // What the user is editing; filled every time the popup opens.
  username = signal('');
  email = signal('');
  password = signal('');
  confirm = signal('');

  typeLabel = computed(() => USER_TYPE_LABELS[this.user().type]);
  mismatch = computed(() => this.confirm().length > 0 && this.confirm() !== this.password());

  // Only what is different from the saved user (PATCH /users/me accepts any subset).
  changes = computed<ProfileChanges>(() => {
    const user = this.user();
    const username = this.username().trim();
    const email = this.email().trim().toLowerCase();
    const changes: ProfileChanges = {};
    if (username !== user.username) changes.username = username;
    if (email !== user.email) changes.email = email;
    if (this.password()) changes.password = this.password();
    return changes;
  });

  canSave = computed(
    () =>
      Object.keys(this.changes()).length > 0 &&
      this.username().trim().length > 0 &&
      this.email().includes('@') &&
      this.password() === this.confirm(),
  );

  constructor() {
    addIcons({ closeOutline, personOutline, mailOutline, lockClosedOutline, shieldOutline });
  }

  // Before showing: start from the saved data, password fields empty.
  prepare(): void {
    this.username.set(this.user().username);
    this.email.set(this.user().email);
    this.password.set('');
    this.confirm.set('');
  }

  submit(): void {
    if (this.busy() || !this.canSave()) return;
    this.submitted.emit(this.changes());
  }
}
