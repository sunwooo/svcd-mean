import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListModalComponent } from './incident-list-modal.component';

describe('IncidentListModalComponent', () => {
  let component: IncidentListModalComponent;
  let fixture: ComponentFixture<IncidentListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
