import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingData } from './streaming-data';

describe('StreamingData', () => {
  let component: StreamingData;
  let fixture: ComponentFixture<StreamingData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
