import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

// TEMPORARY Users module (admins only, see adminGuard). Exists so the tab has somewhere to go.
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [IonContent, HomeHeaderComponent],
})
export class UsersPage {}
