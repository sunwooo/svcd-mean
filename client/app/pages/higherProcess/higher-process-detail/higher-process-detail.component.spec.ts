import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherProcessDetailComponent } from './higher-process-detail.component';

describe('HigherProcessDetailComponent', () => {
  let component: HigherProcessDetailComponent;
  let fixture: ComponentFixture<HigherProcessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherProcessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
