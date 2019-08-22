import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDeleteComponent } from './select-delete.component';

describe('SelectDeleteComponent', () => {
  let component: SelectDeleteComponent;
  let fixture: ComponentFixture<SelectDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
