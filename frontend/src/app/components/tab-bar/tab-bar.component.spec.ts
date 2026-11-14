import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabBarComponent } from './tab-bar.component';

describe('TabBarComponent', () => {
  function labels(showUsers: boolean): string[] {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(TabBarComponent);
    fixture.componentRef.setInput('showUsers', showUsers);
    fixture.detectChanges();
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.tab span')).map(
      (span) => span.textContent?.trim() ?? '',
    );
  }

  it('hides Users for normal and critic users', () => {
    expect(labels(false)).toEqual(['Home', 'My profile']);
  });

  it('shows Users for admins', () => {
    expect(labels(true)).toEqual(['Home', 'Users', 'My profile']);
  });
});
