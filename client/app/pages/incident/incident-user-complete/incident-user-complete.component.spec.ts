import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentUserCompleteComponent } from './incident-user-complete.component';

describe('IncidentUserCompleteComponent', () => {
  let component: IncidentUserCompleteComponent;
  let fixture: ComponentFixture<IncidentUserCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentUserCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentUserCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
