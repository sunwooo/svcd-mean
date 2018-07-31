import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListAllComponent } from './incident-list-all.component';

describe('IncidentListAllComponent', () => {
  let component: IncidentListAllComponent;
  let fixture: ComponentFixture<IncidentListAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentListAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
