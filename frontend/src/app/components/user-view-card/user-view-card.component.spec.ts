import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { AssignableUserType, UserListItem } from '../../models/user.model';
import { UserTypeSelectorComponent } from '../user-type-selector/user-type-selector.component';

import { UserViewCardComponent } from './user-view-card.component';

const JOSE: UserListItem = {
  _id: 'u5',
  username: 'jose23',
  email: 'jose23@example.com',
  type: 'normal',
  createdAt: '2025-06-20T00:00:00.000Z',
  reviewsCount: 12,
};

describe('UserViewCardComponent', () => {
  let fixture: ComponentFixture<UserViewCardComponent>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(UserViewCardComponent);
  });

  it('shows the user and re-emits the switch as typeChange', () => {
    fixture.componentRef.setInput('user', JOSE);
    const emitted: AssignableUserType[] = [];
    fixture.componentInstance.typeChange.subscribe((type) => emitted.push(type));
    fixture.detectChanges();

    expect(el().querySelector('.username')?.textContent?.trim()).toBe('jose23');
    expect(el().querySelector('.meta')?.textContent?.trim()).toBe('Since Jun 20, 2025 · 12 reviews');

    const selector = fixture.debugElement.query((d) => d.componentInstance instanceof UserTypeSelectorComponent)
      .componentInstance as UserTypeSelectorComponent<AssignableUserType>;
    selector.select('critic');
    expect(emitted).toEqual(['critic']);
  });

  it('an admin shows the yellow note instead of the switch', () => {
    fixture.componentRef.setInput('user', { ...JOSE, type: 'admin' });
    fixture.detectChanges();

    expect(el().querySelector('.admin')?.textContent).toContain('Admin · created in the database');
    expect(el().querySelector('app-user-type-selector')).toBeNull();
  });
});
