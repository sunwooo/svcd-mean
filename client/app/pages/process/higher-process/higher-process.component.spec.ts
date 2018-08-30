import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherProcessComponent } from './higher-process.component';

describe('HigherProcessComponent', () => {
  let component: HigherProcessComponent;
  let fixture: ComponentFixture<HigherProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
