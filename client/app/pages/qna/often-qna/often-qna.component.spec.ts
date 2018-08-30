import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OftenQnaComponent } from './often-qna.component';

describe('OftenQnaComponent', () => {
  let component: OftenQnaComponent;
  let fixture: ComponentFixture<OftenQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OftenQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OftenQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
