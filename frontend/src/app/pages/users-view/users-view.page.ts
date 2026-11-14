import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner, ToastController } from '@ionic/angular';
import type { InfiniteScrollCustomEvent } from '@ionic/angular';
import type { Subscription } from 'rxjs';

import { apiErrorMessage } from '../../api/api-error';
import { UsersApi } from '../../api/users.api';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { UserTypeBadgeComponent } from '../../components/user-type-badge/user-type-badge.component';
import { UserViewCardComponent } from '../../components/user-view-card/user-view-card.component';
import type { AssignableUserType, UserListItem, UserType } from '../../models/user.model';

// Users module (/tabs/users, admins only: adminGuard + the tab only shows for admins).
// Top to bottom: title + Admin badge, search-bar (username or email), user-filter
// (All / Normal / Critics), "N users" and one user-view-card per user.
// Same pattern as Home: the page owns query and type; an effect reloads the list when they change.
@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.page.html',
  styleUrls: ['./users-view.page.scss'],
  imports: [
    IonContent,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    SearchBarComponent,
    UserFilterComponent,
    UserTypeBadgeComponent,
    UserViewCardComponent,
  ],
})
export class UsersViewPage {
  private usersApi = inject(UsersApi);
  private toastCtrl = inject(ToastController);
  private request?: Subscription;

  // What the admin chose
  query = signal('');
  type = signal<UserType | null>(null); // null = All

  // What the API answered
  users = signal<UserListItem[]>([]);
  total = signal(0);
  page = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  // The user whose type is being saved (its switch is disabled meanwhile).
  savingId = signal<string | null>(null);

  hasMore = computed(() => this.users().length < this.total());
  summary = computed(() => `${this.total()} ${this.total() === 1 ? 'user' : 'users'}`);

  constructor() {
    // Now and every time the search text or the type chip changes: load again from page 1.
    effect(() => {
      this.query();
      this.type();
      untracked(() => this.load(1));
    });
  }

  loadMore(event: InfiniteScrollCustomEvent): void {
    this.load(this.page() + 1, () => void event.target.complete());
  }

  retry(): void {
    this.load(1);
  }

  // The switch of a user-view-card changed: PATCH /users/:id/type.
  // The card changes at once (optimistic); if the API fails it goes back and a toast explains why.
  changeType(user: UserListItem, type: AssignableUserType): void {
    if (this.savingId()) return; // one change at a time
    const previous = user.type;
    this.setType(user._id, type);
    this.savingId.set(user._id);

    this.usersApi.changeType(user._id, type).subscribe({
      next: () => {
        this.savingId.set(null);
        void this.showToast(`${user.username} is now ${type === 'critic' ? 'a critic' : 'a normal user'}.`);
      },
      error: (err: unknown) => {
        this.setType(user._id, previous);
        this.savingId.set(null);
        void this.showToast(apiErrorMessage(err));
      },
    });
  }

  private setType(userId: string, type: UserType): void {
    this.users.update((list) => list.map((u) => (u._id === userId ? { ...u, type } : u)));
  }

  private load(page: number, done?: () => void): void {
    // Drop an older request that is still running (e.g. the admin kept typing).
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);
    if (page === 1) this.users.set([]);

    this.request = this.usersApi.list({ q: this.query(), type: this.type(), page }).subscribe({
      next: (result) => {
        this.users.update((list) => (page === 1 ? result.data : [...list, ...result.data]));
        this.total.set(result.total);
        this.page.set(page);
        this.loading.set(false);
        done?.();
      },
      error: (err: unknown) => {
        this.error.set(apiErrorMessage(err));
        this.loading.set(false);
        done?.();
      },
    });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'top' });
    await toast.present();
  }
}
