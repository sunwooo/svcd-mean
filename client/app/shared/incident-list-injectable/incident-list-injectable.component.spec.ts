import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListInjectableComponent } from './incident-list-injectable.component';

describe('IncidentListInjectableComponent', () => {
  let component: IncidentListInjectableComponent;
  let fixture: ComponentFixture<IncidentListInjectableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentListInjectableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListInjectableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
