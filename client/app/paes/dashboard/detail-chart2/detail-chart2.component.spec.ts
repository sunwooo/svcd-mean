import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChart2Component } from './detail-chart2.component';

describe('DetailChart2Component', () => {
  let component: DetailChart2Component;
  let fixture: ComponentFixture<DetailChart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailChart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
