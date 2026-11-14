import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { LoginCredentials } from '../../models/auth.model';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can only submit when both fields have text', () => {
    expect(component.canSubmit()).toBe(false);

    component.login.set('marielv');
    expect(component.canSubmit()).toBe(false);

    component.password.set('secret');
    expect(component.canSubmit()).toBe(true);
  });

  it('emits the trimmed credentials', () => {
    const emitted: LoginCredentials[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.login.set('  marielv  ');
    component.password.set('secret');
    component.submit();

    expect(emitted).toEqual([{ login: 'marielv', password: 'secret' }]);
  });
});
