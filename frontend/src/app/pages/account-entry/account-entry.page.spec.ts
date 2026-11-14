import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccountEntryPage } from './account-entry.page';

describe('AccountEntryPage', () => {
  let component: AccountEntryPage;
  let fixture: ComponentFixture<AccountEntryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEntryPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on Log in', () => {
    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('h1')?.textContent).toContain('SpoilerAlert');
    expect(html.querySelector('app-login-form')).not.toBeNull();
    expect(html.querySelector('app-signup-form')).toBeNull();
  });

  it('shows the Sign up form when the mode changes', () => {
    component.mode.set('signup');
    fixture.detectChanges();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('h1')?.textContent).toContain('Create your profile');
    expect(html.querySelector('app-signup-form')).not.toBeNull();
    expect(html.querySelector('app-login-form')).toBeNull();
  });
});
