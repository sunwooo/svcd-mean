import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaMngComponent } from './qna-mng.component';

describe('QnaMngComponent', () => {
  let component: QnaMngComponent;
  let fixture: ComponentFixture<QnaMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QnaMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
