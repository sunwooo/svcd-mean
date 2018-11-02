import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCompanyContentComponent } from './main-company-content.component';

describe('MainCompanyContentComponent', () => {
  let component: MainCompanyContentComponent;
  let fixture: ComponentFixture<MainCompanyContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCompanyContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCompanyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
