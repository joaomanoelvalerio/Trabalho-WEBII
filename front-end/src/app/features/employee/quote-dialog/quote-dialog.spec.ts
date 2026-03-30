import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteDialog } from './quote-dialog';

describe('QuoteDialog', () => {
  let component: QuoteDialog;
  let fixture: ComponentFixture<QuoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
