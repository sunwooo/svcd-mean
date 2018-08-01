import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCompleteComponent } from './incident-complete.component';

describe('IncidentCompleteComponent', () => {
  let component: IncidentCompleteComponent;
  let fixture: ComponentFixture<IncidentCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
