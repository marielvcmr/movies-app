import { Component, input } from '@angular/core';

// A titled block of Details. The title comes as an input and the body goes between the
// tags (<ng-content />), so any content fits:
// <app-detail-section heading="Synopsis"><p>{{ synopsis }}</p></app-detail-section>
// <app-detail-section heading="Actors"><app-chip-list ... /></app-detail-section>
@Component({
  selector: 'app-detail-section',
  templateUrl: './detail-section.component.html',
  styleUrls: ['./detail-section.component.scss'],
})
export class DetailSectionComponent {
  heading = input.required<string>();
}
