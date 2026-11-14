import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { Movie } from '../../models/program.model';
import type { Review, ReviewInput } from '../../models/review.model';

import { MyReviewSheetComponent } from './my-review-sheet.component';

const DUNE: Movie = {
  _id: 'p1',
  type: 'movie',
  externalId: 'tt1',
  title: 'Dune',
  year: 2021,
  releaseDate: null,
  posterUrl: null,
  genres: [],
  actors: [],
  synopsis: null,
  pointsMeanCritics: null,
  pointsMeanNormal: null,
  durationMin: 155,
};

const MINE: Review = {
  _id: 'r1',
  author: 'u1',
  program: 'p1',
  points: 88,
  comment: 'Loved it',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('MyReviewSheetComponent', () => {
  let fixture: ComponentFixture<MyReviewSheetComponent>;
  let sheet: MyReviewSheetComponent;
  let submitted: ReviewInput[];

  function create(review: Review | null) {
    fixture = TestBed.createComponent(MyReviewSheetComponent);
    sheet = fixture.componentInstance;
    fixture.componentRef.setInput('program', DUNE);
    fixture.componentRef.setInput('review', review);
    submitted = [];
    sheet.submitted.subscribe((input) => submitted.push(input));
    fixture.detectChanges();
    sheet.prepare(); // what (willPresent) does when the popup opens
  }

  it('new review: starts at 70 with no comment, "Publish review"', () => {
    create(null);
    expect(sheet.points()).toBe(70);
    expect(sheet.comment()).toBe('');
    expect(sheet.heading()).toBe('Your review');
    expect(sheet.saveLabel()).toBe('Publish review');
  });

  it('existing review: starts from it, "Save changes"', () => {
    create(MINE);
    expect(sheet.points()).toBe(88);
    expect(sheet.comment()).toBe('Loved it');
    expect(sheet.heading()).toBe('Edit review');
    expect(sheet.saveLabel()).toBe('Save changes');
  });

  it('sends the points and the trimmed comment (empty → null)', () => {
    create(null);
    sheet.points.set(91);
    sheet.comment.set('   ');
    sheet.submit();
    sheet.comment.set('  Great  ');
    sheet.submit();
    expect(submitted).toEqual([
      { points: 91, comment: null },
      { points: 91, comment: 'Great' },
    ]);
  });

  it('does not send twice while busy', () => {
    create(null);
    fixture.componentRef.setInput('busy', true);
    sheet.submit();
    expect(submitted).toEqual([]);
  });
});
