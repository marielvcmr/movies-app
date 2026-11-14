import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SignupFormComponent } from './signup-form.component';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fill(confirm: string): void {
    component.username.set('marielv');
    component.email.set('marielv@example.com');
    component.password.set('secret');
    component.confirm.set(confirm);
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('warns and blocks the button when the passwords do not match', () => {
    fill('other');

    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('[role="alert"]')?.textContent).toContain("Passwords don't match.");
    expect(component.canSubmit()).toBe(false);
  });

  it('allows submitting when everything is valid', () => {
    fill('secret');

    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('[role="alert"]')).toBeNull();
    expect(component.canSubmit()).toBe(true);
  });
});
