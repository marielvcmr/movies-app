import { TestBed } from '@angular/core/testing';

import type { Program } from '../../models/program.model';

import { ProgramReviewCardComponent } from './program-review-card.component';

const BASE = {
  _id: 'x',
  externalId: 'tt0',
  title: 'Dune: Part Two',
  year: 2024,
  releaseDate: null,
  posterUrl: null,
  genres: [],
  actors: [],
  synopsis: null,
  pointsMeanCritics: null,
  pointsMeanNormal: null,
};

describe('ProgramReviewCardComponent', () => {
  function meta(program: Program): string {
    const fixture = TestBed.createComponent(ProgramReviewCardComponent);
    fixture.componentRef.setInput('program', program);
    fixture.detectChanges();
    return fixture.componentInstance.meta();
  }

  it('movie: type · year · duration', () => {
    expect(meta({ ...BASE, type: 'movie', durationMin: 166 })).toBe('Movie · 2024 · 166 min');
  });

  it('series without seasons: type · year', () => {
    expect(meta({ ...BASE, type: 'series', seasonsCount: null })).toBe('Series · 2024');
  });
});
