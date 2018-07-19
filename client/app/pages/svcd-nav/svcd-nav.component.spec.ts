import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcdNavComponent } from './svcd-nav.component';

describe('SvcdNavComponent', () => {
  let component: SvcdNavComponent;
  let fixture: ComponentFixture<SvcdNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvcdNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvcdNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
