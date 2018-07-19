import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComHigherComponent } from './com-higher.component';

describe('ComHigherComponent', () => {
  let component: ComHigherComponent;
  let fixture: ComponentFixture<ComHigherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComHigherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComHigherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
