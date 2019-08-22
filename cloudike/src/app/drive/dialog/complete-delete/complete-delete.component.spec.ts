import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDeleteComponent } from './complete-delete.component';

describe('CompleteDeleteComponent', () => {
  let component: CompleteDeleteComponent;
  let fixture: ComponentFixture<CompleteDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
