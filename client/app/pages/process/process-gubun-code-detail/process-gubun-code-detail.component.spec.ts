import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGubunCodeDetailComponent } from './process-gubun-code-detail.component';

describe('ProcessGubunCodeDetailComponent', () => {
  let component: ProcessGubunCodeDetailComponent;
  let fixture: ComponentFixture<ProcessGubunCodeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessGubunCodeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessGubunCodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
