import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailAComponent } from './company-detail-a.component';

describe('CompanyDetailAComponent', () => {
  let component: CompanyDetailAComponent;
  let fixture: ComponentFixture<CompanyDetailAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
