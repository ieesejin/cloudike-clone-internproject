import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFavoritesComponent } from './header-favorites.component';

describe('HeaderFavoritesComponent', () => {
  let component: HeaderFavoritesComponent;
  let fixture: ComponentFixture<HeaderFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
