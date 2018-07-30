import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanageListComponent } from './usermanage-list.component';

describe('UsermanageListComponent', () => {
  let component: UsermanageListComponent;
  let fixture: ComponentFixture<UsermanageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
