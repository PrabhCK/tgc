import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOrderDialougeComponent } from './place-order-dialouge.component';

describe('PlaceOrderDialougeComponent', () => {
  let component: PlaceOrderDialougeComponent;
  let fixture: ComponentFixture<PlaceOrderDialougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceOrderDialougeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceOrderDialougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
