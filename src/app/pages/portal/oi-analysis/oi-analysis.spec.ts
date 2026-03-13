import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiAnalysis } from './oi-analysis';

describe('OiAnalysis', () => {
  let component: OiAnalysis;
  let fixture: ComponentFixture<OiAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OiAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
