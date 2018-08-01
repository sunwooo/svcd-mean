import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentHoldComponent } from './incident-hold.component';

describe('IncidentHoldComponent', () => {
  let component: IncidentHoldComponent;
  let fixture: ComponentFixture<IncidentHoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentHoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
