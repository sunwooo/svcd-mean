import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentValuationComponent } from './incident-valuation.component';

describe('IncidentValuationComponent', () => {
  let component: IncidentValuationComponent;
  let fixture: ComponentFixture<IncidentValuationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentValuationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
