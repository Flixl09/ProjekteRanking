import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listview } from './listview';

describe('Listview', () => {
  let component: Listview;
  let fixture: ComponentFixture<Listview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
