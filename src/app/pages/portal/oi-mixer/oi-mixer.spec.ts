import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiMixer } from './oi-mixer';

describe('OiMixer', () => {
  let component: OiMixer;
  let fixture: ComponentFixture<OiMixer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OiMixer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiMixer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
