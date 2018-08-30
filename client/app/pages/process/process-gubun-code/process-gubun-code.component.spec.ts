import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGubunCodeComponent } from './process-gubun-code.component';

describe('ProcessGubunCodeComponent', () => {
  let component: ProcessGubunCodeComponent;
  let fixture: ComponentFixture<ProcessGubunCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessGubunCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessGubunCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
