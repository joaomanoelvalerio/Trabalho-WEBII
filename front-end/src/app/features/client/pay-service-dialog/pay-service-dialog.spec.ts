import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayServiceDialog } from './pay-service-dialog';

describe('PayServiceDialog', () => {
  let component: PayServiceDialog;
  let fixture: ComponentFixture<PayServiceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayServiceDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PayServiceDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
