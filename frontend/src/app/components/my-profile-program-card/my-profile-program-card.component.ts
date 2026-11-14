import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonRouterLinkWithHref } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

import { PROGRAM_TYPE_LABELS } from '../../constants/labels';
import type { UserReview } from '../../models/review.model';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// One of my reviews in My profile: mini poster without name + title, "Movie · 2024",
// points and stars. Poster and text open Details; on the right, edit and delete.
// It doesn't edit or delete anything itself: it emits and the page does it.
// <app-my-profile-program-card [review]="r" (edit)="openEdit(r)" (delete)="askDelete(r)" />
@Component({
  selector: 'app-my-profile-program-card',
  templateUrl: './my-profile-program-card.component.html',
  styleUrls: ['./my-profile-program-card.component.scss'],
  imports: [RouterLink, IonRouterLinkWithHref, IonIcon, ProgramCardSimpleComponent, StarRatingComponent],
})
export class MyProfileProgramCardComponent {
  review = input.required<UserReview>();

  edit = output<void>();
  delete = output<void>();

  program = computed(() => this.review().program);
  meta = computed(() => `${PROGRAM_TYPE_LABELS[this.program().type]} · ${this.program().year}`);

  constructor() {
    addIcons({ createOutline, trashOutline });
  }
}
