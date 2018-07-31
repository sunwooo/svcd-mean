import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentHigherChangeComponent } from './incident-higher-change.component';

describe('IncidentHigherChangeComponent', () => {
  let component: IncidentHigherChangeComponent;
  let fixture: ComponentFixture<IncidentHigherChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentHigherChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentHigherChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
