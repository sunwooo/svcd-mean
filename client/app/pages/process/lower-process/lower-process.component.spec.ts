import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerProcessComponent } from './lower-process.component';

describe('LowerProcessComponent', () => {
  let component: LowerProcessComponent;
  let fixture: ComponentFixture<LowerProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
