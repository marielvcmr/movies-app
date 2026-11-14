import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';

import type { User } from '../../models/user.model';
import { avatarColor } from '../../utils/colors';
import { formatDate } from '../../utils/format';
import { UserTypeBadgeComponent } from '../user-type-badge/user-type-badge.component';

// Top of My profile: avatar with the initial, username, type badge, "Member since ..."
// and the email box (only the owner sees the email, so this is only for My profile).
// <app-my-profile-info [user]="user" />
@Component({
  selector: 'app-my-profile-info',
  templateUrl: './my-profile-info.component.html',
  styleUrls: ['./my-profile-info.component.scss'],
  imports: [IonIcon, UserTypeBadgeComponent],
})
export class MyProfileInfoComponent {
  user = input.required<User>();

  initial = computed(() => this.user().username.charAt(0).toUpperCase());
  avatar = computed(() => avatarColor(this.user().username));
  memberSince = computed(() => formatDate(this.user().createdAt));

  constructor() {
    addIcons({ mailOutline });
  }
}
