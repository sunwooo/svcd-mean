import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailAComponent } from './incident-detail-a.component';

describe('IncidentDetailAComponent', () => {
  let component: IncidentDetailAComponent;
  let fixture: ComponentFixture<IncidentDetailAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentDetailAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDetailAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
