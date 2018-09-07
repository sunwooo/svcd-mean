import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaNewComponent } from './qna-new.component';

describe('QnaNewComponent', () => {
  let component: QnaNewComponent;
  let fixture: ComponentFixture<QnaNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QnaNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
