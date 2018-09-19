import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGubunCodeNewComponent } from './process-gubun-code-new.component';

describe('ProcessGubunCodeNewComponent', () => {
  let component: ProcessGubunCodeNewComponent;
  let fixture: ComponentFixture<ProcessGubunCodeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessGubunCodeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessGubunCodeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
