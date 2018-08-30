import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProcessComponent } from './company-process.component';

describe('CompanyProcessComponent', () => {
  let component: CompanyProcessComponent;
  let fixture: ComponentFixture<CompanyProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
