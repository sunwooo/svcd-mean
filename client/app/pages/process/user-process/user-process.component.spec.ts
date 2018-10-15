import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProcessComponent } from './user-process.component';

describe('UserProcessComponent', () => {
  let component: UserProcessComponent;
  let fixture: ComponentFixture<UserProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
