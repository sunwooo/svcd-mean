import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerCdComponent } from './lower-cd.component';

describe('LowerCdComponent', () => {
  let component: LowerCdComponent;
  let fixture: ComponentFixture<LowerCdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerCdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
