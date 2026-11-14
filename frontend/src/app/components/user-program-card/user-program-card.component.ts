import { Component, computed, input } from '@angular/core';

import { PROGRAM_TYPE_LABELS } from '../../constants/labels';
import type { UserReview } from '../../models/review.model';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// One review in another user's profile: mini poster without name + title, "Movie · 2024",
// points /100, stars and the comment if there is one.
// The page wraps it in a link to Details: <a [routerLink]="..."><app-user-program-card [review]="r" /></a>
@Component({
  selector: 'app-user-program-card',
  templateUrl: './user-program-card.component.html',
  styleUrls: ['./user-program-card.component.scss'],
  imports: [ProgramCardSimpleComponent, StarRatingComponent],
})
export class UserProgramCardComponent {
  review = input.required<UserReview>();

  program = computed(() => this.review().program);
  meta = computed(() => `${PROGRAM_TYPE_LABELS[this.program().type]} · ${this.program().year}`);
}
