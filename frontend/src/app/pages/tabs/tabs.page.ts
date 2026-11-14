import { Component, inject } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

import { TabBarComponent } from '../../components/tab-bar/tab-bar.component';
import { AuthService } from '../../services/auth.service';

// Frame of the tab screens (Home, My profile, Users): the current tab on top and the
// tab bar below. Screens outside the tabs (Details, Log in) don't show the bar.
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonRouterOutlet, TabBarComponent],
})
export class TabsPage {
  auth = inject(AuthService);
}
