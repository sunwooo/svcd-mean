import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentConditionComponent } from './incident-condition.component';

describe('IncidentConditionComponent', () => {
  let component: IncidentConditionComponent;
  let fixture: ComponentFixture<IncidentConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
