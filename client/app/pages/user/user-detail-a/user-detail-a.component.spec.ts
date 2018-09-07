import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailAComponent } from './user-detail-a.component';

describe('UserDetailAComponent', () => {
  let component: UserDetailAComponent;
  let fixture: ComponentFixture<UserDetailAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
