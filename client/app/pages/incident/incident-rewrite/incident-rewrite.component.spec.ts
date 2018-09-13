import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentRewriteComponent } from './incident-rewrite.component';

describe('IncidentRewriteComponent', () => {
  let component: IncidentRewriteComponent;
  let fixture: ComponentFixture<IncidentRewriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentRewriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentRewriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
