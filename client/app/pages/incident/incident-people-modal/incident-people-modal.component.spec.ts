import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPeopleModalComponent } from './incident-people-modal.component';

describe('IncidentPeopleModalComponent', () => {
  let component: IncidentPeopleModalComponent;
  let fixture: ComponentFixture<IncidentPeopleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentPeopleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentPeopleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
