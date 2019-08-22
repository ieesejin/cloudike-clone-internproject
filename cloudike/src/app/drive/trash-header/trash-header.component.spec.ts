import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashHeaderComponent } from './trash-header.component';

describe('TrashHeaderComponent', () => {
  let component: TrashHeaderComponent;
  let fixture: ComponentFixture<TrashHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
