import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeAnalysis } from './trade-analysis';

describe('TradeAnalysis', () => {
  let component: TradeAnalysis;
  let fixture: ComponentFixture<TradeAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
