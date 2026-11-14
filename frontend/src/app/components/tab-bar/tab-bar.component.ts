import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, IonRouterLinkWithHref } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, peopleOutline, personCircleOutline } from 'ionicons/icons';

interface Tab {
  path: string;
  label: string;
  icon: string;
  adminOnly: boolean;
}

const TABS: Tab[] = [
  { path: '/tabs/home', label: 'Home', icon: 'home-outline', adminOnly: false },
  { path: '/tabs/users', label: 'Users', icon: 'people-outline', adminOnly: true },
  { path: '/tabs/profile', label: 'My profile', icon: 'person-circle-outline', adminOnly: false },
];

// Bottom tabs: Home, Users (admins only) and My profile. The active tab is shown in red.
// It doesn't know who is logged in: the page tells it whether to show Users.
// <app-tab-bar [showUsers]="auth.isAdmin()" />
@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  imports: [IonIcon, RouterLink, RouterLinkActive, IonRouterLinkWithHref],
})
export class TabBarComponent {
  showUsers = input(false);

  tabs = computed(() => TABS.filter((tab) => !tab.adminOnly || this.showUsers()));

  constructor() {
    addIcons({ homeOutline, peopleOutline, personCircleOutline });
  }
}
