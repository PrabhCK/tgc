import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperTradingComponent } from './paper-trading.component';

describe('PaperTradingComponent', () => {
  let component: PaperTradingComponent;
  let fixture: ComponentFixture<PaperTradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperTradingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
