import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { UserType } from '../../models/user.model';

import { UserTypeBadgeComponent } from './user-type-badge.component';

describe('UserTypeBadgeComponent', () => {
  let fixture: ComponentFixture<UserTypeBadgeComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  function render(type: UserType, showIcon = false) {
    fixture = TestBed.createComponent(UserTypeBadgeComponent);
    fixture.componentRef.setInput('type', type);
    fixture.componentRef.setInput('showIcon', showIcon);
    fixture.detectChanges();
  }

  it('shows the label of each type and uses the type as its class', () => {
    render('normal');
    expect(html().textContent?.trim()).toBe('Normal user');
    expect(html().classList).toContain('normal');

    render('critic');
    expect(html().textContent?.trim()).toBe('Critic');

    render('admin');
    expect(html().textContent?.trim()).toBe('Admin');
  });

  it('shows the icon only when asked', () => {
    render('critic');
    expect(html().querySelector('ion-icon')).toBeNull();

    render('critic', true);
    expect(html().querySelector('ion-icon')).not.toBeNull();
  });
});
