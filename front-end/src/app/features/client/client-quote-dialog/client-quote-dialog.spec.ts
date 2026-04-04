import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQuoteDialog } from './client-quote-dialog';

describe('ClientQuoteDialog', () => {
  let component: ClientQuoteDialog;
  let fixture: ComponentFixture<ClientQuoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientQuoteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientQuoteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
