import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

import type { PublicProfile } from '../../models/user.model';
import { avatarColor } from '../../utils/colors';
import { formatDate } from '../../utils/format';
import { UserTypeBadgeComponent } from '../user-type-badge/user-type-badge.component';

// Top of another user's profile, centered: big avatar with the initial, username,
// type badge and "Member since ...". Only public data: never the email.
// <app-user-profile-info [profile]="profile" />
@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.scss'],
  imports: [IonIcon, UserTypeBadgeComponent],
})
export class UserProfileInfoComponent {
  profile = input.required<PublicProfile>();

  initial = computed(() => this.profile().username.charAt(0).toUpperCase());
  avatar = computed(() => avatarColor(this.profile().username));
  memberSince = computed(() => formatDate(this.profile().createdAt));

  constructor() {
    addIcons({ calendarOutline });
  }
}
