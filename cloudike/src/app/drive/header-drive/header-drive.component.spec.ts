import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDriveComponent } from './header-drive.component';

describe('HeaderDriveComponent', () => {
  let component: HeaderDriveComponent;
  let fixture: ComponentFixture<HeaderDriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderDriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
