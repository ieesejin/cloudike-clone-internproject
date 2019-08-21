import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFavoritesComponent } from './delete-favorites.component';

describe('DeleteFavoritesComponent', () => {
  let component: DeleteFavoritesComponent;
  let fixture: ComponentFixture<DeleteFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
