import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherCdComponent } from './higher-cd.component';

describe('HigherCdComponent', () => {
  let component: HigherCdComponent;
  let fixture: ComponentFixture<HigherCdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherCdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
