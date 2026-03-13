import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breaksout } from './breaksout';

describe('Breaksout', () => {
  let component: Breaksout;
  let fixture: ComponentFixture<Breaksout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breaksout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Breaksout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
