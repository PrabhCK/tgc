import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevFiiDiiActivity } from './prev-fii-dii-activity';

describe('PrevFiiDiiActivity', () => {
  let component: PrevFiiDiiActivity;
  let fixture: ComponentFixture<PrevFiiDiiActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevFiiDiiActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevFiiDiiActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
