import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerProcessNewComponent } from './lower-process-new.component';

describe('LowerProcessNewComponent', () => {
  let component: LowerProcessNewComponent;
  let fixture: ComponentFixture<LowerProcessNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerProcessNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerProcessNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
