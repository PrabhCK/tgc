import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvSupportResistance } from './adv-support-resistance';

describe('AdvSupportResistance', () => {
  let component: AdvSupportResistance;
  let fixture: ComponentFixture<AdvSupportResistance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvSupportResistance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvSupportResistance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
