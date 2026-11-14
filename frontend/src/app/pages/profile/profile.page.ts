import { Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';

import { ButtonComponent } from '../../components/button/button.component';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { AuthService } from '../../services/auth.service';

// TEMPORARY My profile: only who is logged in and "Log out", so the session can be tested.
// The real screen (stats, my reviews, edit, delete account) comes later.
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonContent, ButtonComponent, HomeHeaderComponent],
})
export class ProfilePage {
  auth = inject(AuthService);
  private navCtrl = inject(NavController);

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.navCtrl.navigateRoot('/login');
  }
}
