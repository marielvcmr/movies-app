import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { UserReview } from '../../models/review.model';

import { MyProfileProgramCardComponent } from './my-profile-program-card.component';

const REVIEW: UserReview = {
  _id: 'r1',
  program: { _id: 'p1', title: 'Dune: Part Two', type: 'movie', year: 2024, posterUrl: null },
  points: 88,
  comment: 'Loved it',
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('MyProfileProgramCardComponent', () => {
  let fixture: ComponentFixture<MyProfileProgramCardComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(MyProfileProgramCardComponent);
    fixture.componentRef.setInput('review', REVIEW);
    fixture.detectChanges();
  });

  it('shows the poster without name, title, meta and points, and links to Details', () => {
    expect(html().querySelector('.fallback-title')).toBeNull();
    expect(html().querySelector('.title')?.textContent).toBe('Dune: Part Two');
    expect(html().querySelector('.meta')?.textContent).toBe('Movie · 2024');
    expect(html().querySelector('.number')?.textContent).toBe('88');
    expect(html().querySelector('a')?.getAttribute('href')).toBe('/programs/p1');
  });

  it('emits edit and delete', () => {
    let edits = 0;
    let deletes = 0;
    fixture.componentInstance.edit.subscribe(() => edits++);
    fixture.componentInstance.delete.subscribe(() => deletes++);

    html().querySelector<HTMLButtonElement>('.edit')?.click();
    html().querySelector<HTMLButtonElement>('.delete')?.click();
    expect(edits).toBe(1);
    expect(deletes).toBe(1);
  });
});
