import { Component, computed, inject, input, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonSpinner,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';

import { apiErrorMessage } from '../../api/api-error';
import { ProgramsApi } from '../../api/programs.api';
import { ButtonComponent } from '../../components/button/button.component';
import { ChipListComponent } from '../../components/chip-list/chip-list.component';
import { DetailSectionComponent } from '../../components/detail-section/detail-section.component';
import { ProgramDetailCardComponent } from '../../components/program-detail-card/program-detail-card.component';
import { ProgramFactsComponent } from '../../components/program-facts/program-facts.component';
import { ScoreDetailCardComponent } from '../../components/score-detail-card/score-detail-card.component';
import { GENRE_LABELS } from '../../constants/labels';
import type { Program } from '../../models/program.model';
import { posterTone } from '../../utils/poster-tone';

// Details of one movie or series (/programs/:id).
// Top to bottom: program-detail-card, categories (chip-list), the two score-detail-cards,
// program-facts, Synopsis and Actors (detail-section), and "Write a review" fixed at the bottom.
@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.page.html',
  styleUrls: ['./program-detail.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonSpinner,
    ButtonComponent,
    ChipListComponent,
    DetailSectionComponent,
    ProgramDetailCardComponent,
    ProgramFactsComponent,
    ScoreDetailCardComponent,
  ],
})
export class ProgramDetailPage implements OnInit {
  private programsApi = inject(ProgramsApi);
  private toastCtrl = inject(ToastController);

  // The :id of the URL (withComponentInputBinding in main.ts).
  id = input.required<string>();

  program = signal<Program | null>(null);
  error = signal<string | null>(null);

  genreLabels = computed(() => (this.program()?.genres ?? []).map((genre) => GENRE_LABELS[genre]));
  // Blurred poster behind the header; a solid tone when there's no image.
  heroImage = computed(() => {
    const url = this.program()?.posterUrl;
    return url ? `url("${url}")` : 'none';
  });
  heroTone = computed(() => posterTone(this.program()?.title ?? ''));

  constructor() {
    addIcons({ createOutline });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.programsApi.getById(this.id()).subscribe({
      next: (program) => this.program.set(program),
      error: (err: unknown) => this.error.set(apiErrorMessage(err)),
    });
  }

  // TODO: open My review (/programs/:id/review) once that screen exists.
  async writeReview(): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: 'Reviews are coming soon.',
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
