import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourOfour } from './four-ofour';

describe('FourOfour', () => {
  let component: FourOfour;
  let fixture: ComponentFixture<FourOfour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourOfour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourOfour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
