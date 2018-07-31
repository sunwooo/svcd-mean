import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReceiptComponent } from './incident-receipt.component';

describe('IncidentReceiptComponent', () => {
  let component: IncidentReceiptComponent;
  let fixture: ComponentFixture<IncidentReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
