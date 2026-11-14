import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonRouterLinkWithHref } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shieldOutline } from 'ionicons/icons';

import { ASSIGNABLE_USER_TYPE_OPTIONS } from '../../constants/labels';
import type { AssignableUserType, UserListItem } from '../../models/user.model';
import { UserType } from '../../models/user.model';
import { avatarColor } from '../../utils/colors';
import { formatCount, formatDate } from '../../utils/format';
import { UserTypeSelectorComponent } from '../user-type-selector/user-type-selector.component';

// One user in the Users module (admins only): avatar with the initial, username (opens the
// public profile), email, "Since … · N reviews", and below:
//   - Normal / Critic switch (user-type-selector) to change the type, or
//   - "Admin · created in the database" for admins, who can't be changed.
// It doesn't call the API: it emits (typeChange) and the page saves it.
// <app-user-view-card [user]="u" [busy]="savingId() === u._id" (typeChange)="changeType(u, $event)" />
@Component({
  selector: 'app-user-view-card',
  templateUrl: './user-view-card.component.html',
  styleUrls: ['./user-view-card.component.scss'],
  imports: [RouterLink, IonRouterLinkWithHref, IonIcon, UserTypeSelectorComponent],
})
export class UserViewCardComponent {
  user = input.required<UserListItem>();
  busy = input(false); // while the new type is being saved

  typeChange = output<AssignableUserType>();

  readonly typeOptions = ASSIGNABLE_USER_TYPE_OPTIONS;

  isAdmin = computed(() => this.user().type === UserType.ADMIN);
  // The switch only knows normal / critic (admins don't show it).
  assignableType = computed<AssignableUserType>(() =>
    this.user().type === UserType.CRITIC ? UserType.CRITIC : UserType.NORMAL,
  );
  initial = computed(() => this.user().username.charAt(0).toUpperCase());
  avatar = computed(() => avatarColor(this.user().username));
  meta = computed(() => {
    const { createdAt, reviewsCount } = this.user();
    return `Since ${formatDate(createdAt)} · ${formatCount(reviewsCount, 'review')}`;
  });

  constructor() {
    addIcons({ shieldOutline });
  }
}
