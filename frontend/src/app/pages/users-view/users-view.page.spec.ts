import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { UsersApi } from '../../api/users.api';
import type { UserListQuery } from '../../api/users.api';
import type { UserListItem } from '../../models/user.model';

import { UsersViewPage } from './users-view.page';

const JOSE: UserListItem = {
  _id: 'u5',
  username: 'jose23',
  email: 'jose23@example.com',
  type: 'normal',
  createdAt: '2025-06-20T00:00:00.000Z',
  reviewsCount: 12,
};

describe('UsersViewPage', () => {
  let fixture: ComponentFixture<UsersViewPage>;
  let page: UsersViewPage;
  const listSpy = vi.fn((query: UserListQuery) => of({ data: [JOSE], page: query.page, limit: 20, total: 1 }));
  const changeTypeSpy = vi.fn();

  beforeEach(async () => {
    listSpy.mockClear();
    changeTypeSpy.mockReset();
    await TestBed.configureTestingModule({
      imports: [UsersViewPage],
      providers: [
        provideRouter([]),
        { provide: UsersApi, useValue: { list: listSpy, changeType: changeTypeSpy } },
        { provide: ToastController, useValue: { create: vi.fn(async () => ({ present: vi.fn() })) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersViewPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads every user first and shows one card each', () => {
    expect(listSpy).toHaveBeenLastCalledWith({ q: '', type: null, page: 1 });
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-user-view-card').length).toBe(1);
    expect(page.summary()).toBe('1 user');
  });

  it('searches again when the text or the type chip changes', async () => {
    page.query.set('jose');
    page.type.set('critic');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(listSpy).toHaveBeenLastCalledWith({ q: 'jose', type: 'critic', page: 1 });
  });

  it('changes the type at once and keeps it when the API agrees', () => {
    changeTypeSpy.mockReturnValue(of({ ...JOSE, type: 'critic' }));
    page.changeType(JOSE, 'critic');

    expect(changeTypeSpy).toHaveBeenCalledWith('u5', 'critic');
    expect(page.users()[0].type).toBe('critic');
    expect(page.savingId()).toBeNull();
  });

  it('goes back to the old type when the API fails', () => {
    changeTypeSpy.mockReturnValue(throwError(() => new Error('nope')));
    page.changeType(JOSE, 'critic');

    expect(page.users()[0].type).toBe('normal');
    expect(page.savingId()).toBeNull();
  });
});
