import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherLowerDeptComponent } from './higher-lower-dept.component';

describe('HigherLowerDeptComponent', () => {
  let component: HigherLowerDeptComponent;
  let fixture: ComponentFixture<HigherLowerDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherLowerDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherLowerDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
