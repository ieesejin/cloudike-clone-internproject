import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSettingComponent } from './header-setting.component';

describe('HeaderSettingComponent', () => {
  let component: HeaderSettingComponent;
  let fixture: ComponentFixture<HeaderSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
