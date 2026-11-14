import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProgramsApi } from '../../api/programs.api';
import type { Program } from '../../models/program.model';

import { ProgramDetailPage } from './program-detail.page';

const SEVERANCE: Program = {
  _id: 's3',
  type: 'series',
  externalId: 'tt11280740',
  title: 'Severance',
  year: 2022,
  releaseDate: '2022-02-18T00:00:00.000Z',
  posterUrl: null,
  genres: ['drama', 'science_fiction'],
  actors: ['Adam Scott', 'Britt Lower'],
  synopsis: 'Office workers have their memories split.',
  pointsMeanCritics: 95,
  pointsMeanNormal: 92,
  seasonsCount: 2,
};

describe('ProgramDetailPage', () => {
  async function render(getById: () => unknown) {
    await TestBed.configureTestingModule({
      imports: [ProgramDetailPage],
      providers: [provideRouter([]), { provide: ProgramsApi, useValue: { getById: vi.fn(getById) } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.componentRef.setInput('id', 's3');
    fixture.detectChanges();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  }

  it('shows every part of the program', async () => {
    const { fixture, html } = await render(() => of(SEVERANCE));
    fixture.detectChanges();

    expect(html.querySelector('app-program-detail-card')).not.toBeNull();
    expect(html.querySelectorAll('app-score-detail-card').length).toBe(2);
    expect(html.querySelector('app-program-facts')).not.toBeNull();
    expect(html.querySelector('.synopsis')?.textContent).toContain('memories split');
    expect(html.querySelectorAll('app-detail-section').length).toBe(2); // Synopsis + Actors
    expect(fixture.componentInstance.genreLabels()).toEqual(['Drama', 'Sci-Fi']);
    expect(html.querySelector('app-button')?.textContent).toContain('Write a review');
  });

  it('shows the error with a retry button', async () => {
    const notFound = new HttpErrorResponse({
      status: 404,
      error: { error: { code: 'NOT_FOUND', message: 'Program not found' } },
    });
    const { fixture, html } = await render(() => throwError(() => notFound));
    fixture.detectChanges();

    expect(html.querySelector('[role="alert"]')?.textContent).toContain('Program not found');
    expect(html.querySelector('app-button')).toBeNull();
  });
});
