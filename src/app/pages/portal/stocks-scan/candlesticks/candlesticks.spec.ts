import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Candlesticks } from './candlesticks';

describe('Candlesticks', () => {
  let component: Candlesticks;
  let fixture: ComponentFixture<Candlesticks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candlesticks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Candlesticks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
