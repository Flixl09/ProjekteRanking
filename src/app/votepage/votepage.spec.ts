import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Votepage } from './votepage';

describe('Votepage', () => {
  let component: Votepage;
  let fixture: ComponentFixture<Votepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Votepage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Votepage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
