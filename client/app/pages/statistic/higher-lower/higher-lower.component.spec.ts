import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherLowerComponent } from './higher-lower.component';

describe('HigherLowerComponent', () => {
  let component: HigherLowerComponent;
  let fixture: ComponentFixture<HigherLowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherLowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherLowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
