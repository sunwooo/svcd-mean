import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListMngComponent } from './incident-list-mng.component';

describe('IncidentListMngComponent', () => {
  let component: IncidentListMngComponent;
  let fixture: ComponentFixture<IncidentListMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentListMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
