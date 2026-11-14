import { HttpErrorResponse } from '@angular/common/http';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

import { AccountEntryPage } from './account-entry.page';

// Fakes, so the tests don't call the real API or navigate.
const authStub = { login: vi.fn(), signup: vi.fn() };
const navStub = { navigateRoot: vi.fn() };

describe('AccountEntryPage', () => {
  let component: AccountEntryPage;
  let fixture: ComponentFixture<AccountEntryPage>;

  beforeEach(async () => {
    authStub.login.mockReset().mockResolvedValue(undefined);
    authStub.signup.mockReset().mockResolvedValue(undefined);
    navStub.navigateRoot.mockReset().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [AccountEntryPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authStub },
        { provide: NavController, useValue: navStub },
      ],
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

  it('logs in and goes to Home', async () => {
    await component.onLogin({ login: 'ana', password: 'secret123' });

    expect(authStub.login).toHaveBeenCalledWith({ login: 'ana', password: 'secret123' });
    expect(navStub.navigateRoot).toHaveBeenCalledWith('/tabs/home');
    expect(component.errorMessage()).toBeNull();
  });

  it('shows the API message when the login fails', async () => {
    authStub.login.mockRejectedValue(
      new HttpErrorResponse({
        status: 401,
        error: { error: { code: 'UNAUTHORIZED', message: 'Invalid login or password' } },
      }),
    );

    await component.onLogin({ login: 'ana', password: 'wrong' });
    fixture.detectChanges();

    expect(navStub.navigateRoot).not.toHaveBeenCalled();
    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('.error')?.textContent).toContain('Invalid login or password');
  });

  it('explains a taken username on sign up', async () => {
    authStub.signup.mockRejectedValue(
      new HttpErrorResponse({
        status: 409,
        error: { error: { code: 'CONFLICT', message: 'Already in use: username', details: { fields: ['username'] } } },
      }),
    );

    await component.onSignup({ username: 'ana', email: 'ana@mail.com', password: 'secret123' });

    expect(component.errorMessage()).toBe('That username is already taken.');
  });
});
