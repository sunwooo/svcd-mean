import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyInfoComponent } from './user-my-info.component';

describe('UserMyInfoComponent', () => {
  let component: UserMyInfoComponent;
  let fixture: ComponentFixture<UserMyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
