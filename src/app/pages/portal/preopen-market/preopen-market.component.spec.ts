import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreopenMarketComponent } from './preopen-market.component';

describe('PreopenMarketComponent', () => {
  let component: PreopenMarketComponent;
  let fixture: ComponentFixture<PreopenMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreopenMarketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreopenMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
