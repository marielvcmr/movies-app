import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ribbonOutline } from 'ionicons/icons';

import { USER_TYPE_LABELS } from '../../constants/labels';
import type { UserType } from '../../models/user.model';

// Pill with the user type: "Normal user" (gray), "Critic" (red) or "Admin" (yellow).
// <app-user-type-badge [type]="user.type" />
// <app-user-type-badge [type]="user.type" [showIcon]="true" />  → with the badge icon (public profile)
@Component({
  selector: 'app-user-type-badge',
  templateUrl: './user-type-badge.component.html',
  styleUrls: ['./user-type-badge.component.scss'],
  imports: [IonIcon],
  host: { '[class]': 'type()' },
})
export class UserTypeBadgeComponent {
  type = input.required<UserType>();
  showIcon = input(false);

  label = computed(() => USER_TYPE_LABELS[this.type()]);

  constructor() {
    addIcons({ ribbonOutline });
  }
}
