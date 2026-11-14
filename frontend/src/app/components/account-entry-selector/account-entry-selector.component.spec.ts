import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { AccountMode } from '../../models/auth.model';

import { AccountEntrySelectorComponent } from './account-entry-selector.component';

describe('AccountEntrySelectorComponent', () => {
  let component: AccountEntrySelectorComponent;
  let fixture: ComponentFixture<AccountEntrySelectorComponent>;
  let emitted: AccountMode[];

  beforeEach(async () => {
    fixture = TestBed.createComponent(AccountEntrySelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'login');
    emitted = [];
    component.modeChange.subscribe((mode) => emitted.push(mode));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the other option when it is picked', () => {
    component.select('signup');
    expect(emitted).toEqual(['signup']);
  });

  it('does not emit when the current option is picked again', () => {
    component.select('login');
    expect(emitted).toEqual([]);
  });
});
