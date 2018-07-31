import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentNCompleteComponent } from './incident-n-complete.component';

describe('IncidentNCompleteComponent', () => {
  let component: IncidentNCompleteComponent;
  let fixture: ComponentFixture<IncidentNCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentNCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentNCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
