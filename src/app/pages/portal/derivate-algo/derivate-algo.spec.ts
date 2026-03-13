import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivateAlgo } from './derivate-algo';

describe('DerivateAlgo', () => {
  let component: DerivateAlgo;
  let fixture: ComponentFixture<DerivateAlgo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerivateAlgo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerivateAlgo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
