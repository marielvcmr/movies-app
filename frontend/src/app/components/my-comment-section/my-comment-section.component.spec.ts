import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { MyCommentSectionComponent } from './my-comment-section.component';

describe('MyCommentSectionComponent', () => {
  let fixture: ComponentFixture<MyCommentSectionComponent>;

  function render(comment: string, userType?: string) {
    fixture = TestBed.createComponent(MyCommentSectionComponent);
    fixture.componentRef.setInput('comment', comment);
    if (userType) fixture.componentRef.setInput('userType', userType);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('counts the characters', () => {
    expect(render('Great!').counter()).toBe('6/300');
  });

  it('says which score the review counts toward', () => {
    expect(render('', 'critic').countsToward()).toContain('Critics score');
    expect(render('', 'normal').countsToward()).toContain('Audience score');
    expect(render('', 'admin').countsToward()).toContain('Audience score');
  });

  it('emits what is typed, cut at 300 characters', () => {
    const section = render('');
    const emitted: string[] = [];
    section.commentChange.subscribe((c) => emitted.push(c));

    const textarea = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
    textarea.value = 'x'.repeat(320);
    textarea.dispatchEvent(new Event('input'));

    expect(emitted[0].length).toBe(300);
  });
});
