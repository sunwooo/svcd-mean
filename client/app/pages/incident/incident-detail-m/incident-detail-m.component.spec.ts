import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailMComponent } from './incident-detail-m.component';

describe('IncidentDetailMComponent', () => {
  let component: IncidentDetailMComponent;
  let fixture: ComponentFixture<IncidentDetailMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentDetailMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDetailMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
