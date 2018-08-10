import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherProcessListComponent } from './higher-process-list.component';

describe('HigherProcessListComponent', () => {
  let component: HigherProcessListComponent;
  let fixture: ComponentFixture<HigherProcessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherProcessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
