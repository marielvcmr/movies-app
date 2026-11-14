import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProgramsApi } from '../../api/programs.api';
import { DEFAULT_FILTERS } from '../../constants/filters';
import type { Program, ProgramQuery } from '../../models/program.model';

import { HomePage } from './home.page';

const DUNE: Program = {
  _id: 'm1',
  type: 'movie',
  externalId: 'tt1',
  title: 'Dune',
  year: 2021,
  releaseDate: null,
  posterUrl: null,
  genres: ['science_fiction'],
  actors: [],
  synopsis: null,
  pointsMeanCritics: 83,
  pointsMeanNormal: 84,
  durationMin: 155,
};

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let page: HomePage;
  const listSpy = vi.fn((query: ProgramQuery) => of({ data: [DUNE], page: query.page, limit: 20, total: 1 }));

  beforeEach(async () => {
    listSpy.mockClear();
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), { provide: ProgramsApi, useValue: { list: listSpy } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    page = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads the first page of movies and shows one card per program', () => {
    expect(listSpy).toHaveBeenLastCalledWith({ type: 'movie', q: '', filters: DEFAULT_FILTERS, page: 1 });
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-program-home-card').length).toBe(1);
    expect(page.summary()).toBe('1 movie');
  });

  it('reloads from page 1 when the tab changes', async () => {
    page.type.set('series');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(listSpy).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'series', page: 1 }));
  });

  it('reloads when the filters change', async () => {
    page.filters.set({ ...DEFAULT_FILTERS, genres: ['drama'] });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(listSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ genres: ['drama'] }) }),
    );
  });
});
