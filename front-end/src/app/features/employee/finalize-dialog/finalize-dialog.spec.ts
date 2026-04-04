import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeDialog } from './finalize-dialog';

describe('FinalizeDialog', () => {
  let component: FinalizeDialog;
  let fixture: ComponentFixture<FinalizeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
