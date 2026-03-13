import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rsi } from './rsi';

describe('Rsi', () => {
  let component: Rsi;
  let fixture: ComponentFixture<Rsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
