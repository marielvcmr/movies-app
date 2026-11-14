import { TestBed } from '@angular/core/testing';

import type { User } from '../../models/user.model';

import { MyProfileInfoComponent } from './my-profile-info.component';

const USER: User = {
  _id: 'u1',
  username: 'marielv',
  email: 'marielv@example.com',
  type: 'critic',
  createdAt: '2026-11-08T00:00:00.000Z',
  updatedAt: '2026-11-08T00:00:00.000Z',
};

describe('MyProfileInfoComponent', () => {
  it('shows initial, username, badge, member since and the email', () => {
    const fixture = TestBed.createComponent(MyProfileInfoComponent);
    fixture.componentRef.setInput('user', USER);
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.avatar')?.textContent).toBe('M');
    expect(html.querySelector('.username')?.textContent).toBe('marielv');
    expect(html.querySelector('app-user-type-badge')?.textContent?.trim()).toBe('Critic');
    expect(html.querySelector('.since')?.textContent).toBe('Member since Nov 8, 2026');
    expect(html.querySelector('.address')?.textContent).toBe('marielv@example.com');
  });
});
