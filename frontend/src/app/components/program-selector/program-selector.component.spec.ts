import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ProgramType } from '../../models/program.model';

import { ProgramSelectorComponent } from './program-selector.component';

describe('ProgramSelectorComponent', () => {
  let component: ProgramSelectorComponent;
  let fixture: ComponentFixture<ProgramSelectorComponent>;
  let emitted: ProgramType[];

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'movie');
    emitted = [];
    component.typeChange.subscribe((type) => emitted.push(type));
    fixture.detectChanges();
  });

  it('shows Movies and Series', () => {
    const labels = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ion-label')).map((label) =>
      label.textContent?.trim(),
    );
    expect(labels).toEqual(['Movies', 'Series']);
  });

  it('emits the other type when it is picked', () => {
    component.select('series');
    expect(emitted).toEqual(['series']);
  });

  it('ignores the current type and unknown values', () => {
    component.select('movie');
    component.select('podcast');
    expect(emitted).toEqual([]);
  });
});
