import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDriveComponent } from './nav-drive.component';

describe('NavDriveComponent', () => {
  let component: NavDriveComponent;
  let fixture: ComponentFixture<NavDriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavDriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
