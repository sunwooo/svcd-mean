import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListCompleteComponent } from './incident-list-complete.component';

describe('IncidentListCompleteComponent', () => {
  let component: IncidentListCompleteComponent;
  let fixture: ComponentFixture<IncidentListCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentListCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
