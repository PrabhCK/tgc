import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionChain } from './option-chain';

describe('OptionChain', () => {
  let component: OptionChain;
  let fixture: ComponentFixture<OptionChain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionChain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionChain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
