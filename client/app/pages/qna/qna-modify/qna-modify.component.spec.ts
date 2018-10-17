import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaModifyComponent } from './qna-modify.component';

describe('QnaModifyComponent', () => {
  let component: QnaModifyComponent;
  let fixture: ComponentFixture<QnaModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QnaModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
