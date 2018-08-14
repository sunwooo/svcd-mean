import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OftenqnaDetailComponent } from './oftenqna-detail.component';

describe('OftenqnaDetailComponent', () => {
  let component: OftenqnaDetailComponent;
  let fixture: ComponentFixture<OftenqnaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OftenqnaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OftenqnaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
