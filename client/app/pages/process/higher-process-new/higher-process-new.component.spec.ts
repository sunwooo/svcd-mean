import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherProcessNewComponent } from './higher-process-new.component';

describe('HigherProcessNewComponent', () => {
  let component: HigherProcessNewComponent;
  let fixture: ComponentFixture<HigherProcessNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherProcessNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherProcessNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
