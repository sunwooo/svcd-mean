import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanageDetailAComponent } from './usermanage-detail-a.component';

describe('UsermanageDetailAComponent', () => {
  let component: UsermanageDetailAComponent;
  let fixture: ComponentFixture<UsermanageDetailAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanageDetailAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanageDetailAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
