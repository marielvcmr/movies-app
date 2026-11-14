import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ProfileChanges, User } from '../../models/user.model';

import { EditProfileSheetComponent } from './edit-profile-sheet.component';

const ANA: User = {
  _id: 'u1',
  username: 'ana',
  email: 'ana@example.com',
  type: 'normal',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('EditProfileSheetComponent', () => {
  let fixture: ComponentFixture<EditProfileSheetComponent>;
  let sheet: EditProfileSheetComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileSheetComponent);
    sheet = fixture.componentInstance;
    fixture.componentRef.setInput('user', ANA);
    fixture.detectChanges();
    sheet.prepare(); // what the popup does when it opens
  });

  it('starts with the saved data and nothing to save', () => {
    expect(sheet.username()).toBe('ana');
    expect(sheet.email()).toBe('ana@example.com');
    expect(sheet.changes()).toEqual({});
    expect(sheet.canSave()).toBe(false);
  });

  it('emits only the fields that changed', () => {
    const emitted: ProfileChanges[] = [];
    sheet.submitted.subscribe((changes) => emitted.push(changes));

    sheet.username.set('  ana.m ');
    sheet.email.set('ANA@example.com'); // same email once lowercased: not a change
    sheet.submit();

    expect(emitted).toEqual([{ username: 'ana.m' }]);
  });

  it("can't save while the passwords don't match", () => {
    sheet.password.set('newpass123');
    sheet.confirm.set('newpass12');
    expect(sheet.mismatch()).toBe(true);
    expect(sheet.canSave()).toBe(false);

    sheet.confirm.set('newpass123');
    expect(sheet.canSave()).toBe(true);
    expect(sheet.changes()).toEqual({ password: 'newpass123' });
  });
});
