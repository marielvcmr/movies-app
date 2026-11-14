import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ProfilePointsCardComponent } from './profile-points-card.component';

describe('ProfilePointsCardComponent', () => {
  let fixture: ComponentFixture<ProfilePointsCardComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  function render(points: number | null) {
    fixture = TestBed.createComponent(ProfilePointsCardComponent);
    fixture.componentRef.setInput('points', points);
    fixture.detectChanges();
  }

  it('shows the rounded average out of 100', () => {
    render(80.6);
    expect(html().querySelector('.number')?.textContent).toBe('81');
    expect(html().querySelector('.max')?.textContent).toBe('/100');
  });

  it('shows "—" without "/100" when there are no reviews', () => {
    render(null);
    expect(html().querySelector('.number')?.textContent).toBe('—');
    expect(html().querySelector('.max')).toBeNull();
  });
});
