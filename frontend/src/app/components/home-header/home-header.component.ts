import { Component, input } from '@angular/core';

// Logo + title at the top of the tab screens. The title can change:
// <app-home-header />                     → "SpoilerAlert" (Home)
// <app-home-header title="My profile" />  → for the other tabs later
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent {
  title = input('SpoilerAlert');
}
