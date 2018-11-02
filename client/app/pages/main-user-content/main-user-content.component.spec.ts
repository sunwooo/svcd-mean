import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUserContentComponent } from './main-user-content.component';

describe('MainUserContentComponent', () => {
  let component: MainUserContentComponent;
  let fixture: ComponentFixture<MainUserContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainUserContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainUserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
