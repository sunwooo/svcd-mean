import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChart3Component } from './detail-chart3.component';

describe('DetailChart3Component', () => {
  let component: DetailChart3Component;
  let fixture: ComponentFixture<DetailChart3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailChart3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailChart3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
