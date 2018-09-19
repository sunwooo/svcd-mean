import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChart1Component } from './detail-chart1.component';

describe('DetailChart1Component', () => {
  let component: DetailChart1Component;
  let fixture: ComponentFixture<DetailChart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailChart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
