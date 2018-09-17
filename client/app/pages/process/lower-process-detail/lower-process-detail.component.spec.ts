import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerProcessDetailComponent } from './lower-process-detail.component';

describe('LowerProcessDetailComponent', () => {
  let component: LowerProcessDetailComponent;
  let fixture: ComponentFixture<LowerProcessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerProcessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
