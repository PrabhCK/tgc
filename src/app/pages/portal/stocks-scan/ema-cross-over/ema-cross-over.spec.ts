import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaCrossOver } from './ema-cross-over';

describe('EmaCrossOver', () => {
  let component: EmaCrossOver;
  let fixture: ComponentFixture<EmaCrossOver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmaCrossOver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmaCrossOver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
