import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detailproject } from './detailproject';

describe('Detailproject', () => {
  let component: Detailproject;
  let fixture: ComponentFixture<Detailproject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detailproject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detailproject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
