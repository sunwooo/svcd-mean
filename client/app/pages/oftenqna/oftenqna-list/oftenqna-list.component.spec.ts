import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OftenqnaListComponent } from './oftenqna-list.component';

describe('OftenqnaListComponent', () => {
  let component: OftenqnaListComponent;
  let fixture: ComponentFixture<OftenqnaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OftenqnaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OftenqnaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
