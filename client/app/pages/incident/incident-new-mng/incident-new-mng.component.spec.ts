import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentNewMngComponent } from './incident-new-mng.component';

describe('IncidentNewMngComponent', () => {
  let component: IncidentNewMngComponent;
  let fixture: ComponentFixture<IncidentNewMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentNewMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentNewMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
