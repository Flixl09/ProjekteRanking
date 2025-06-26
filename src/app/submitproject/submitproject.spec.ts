import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Submitproject } from './submitproject';

describe('Submitproject', () => {
  let component: Submitproject;
  let fixture: ComponentFixture<Submitproject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Submitproject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Submitproject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
