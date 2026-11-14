import { TestBed } from '@angular/core/testing';

import type { PublicProfile } from '../../models/user.model';

import { UserProfileInfoComponent } from './user-profile-info.component';

const PROFILE: PublicProfile = {
  _id: 'u9',
  username: 'maria.reviews',
  type: 'critic',
  createdAt: '2025-01-14T00:00:00.000Z',
  reviewsCount: 24,
  pointsMean: 81,
};

describe('UserProfileInfoComponent', () => {
  it('shows initial, username, badge with icon and member since', () => {
    const fixture = TestBed.createComponent(UserProfileInfoComponent);
    fixture.componentRef.setInput('profile', PROFILE);
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.avatar')?.textContent).toBe('M');
    expect(html.querySelector('h1')?.textContent).toBe('maria.reviews');
    expect(html.querySelector('app-user-type-badge ion-icon')).not.toBeNull();
    expect(html.querySelector('.since')?.textContent).toContain('Member since Jan 14, 2025');
  });
});
