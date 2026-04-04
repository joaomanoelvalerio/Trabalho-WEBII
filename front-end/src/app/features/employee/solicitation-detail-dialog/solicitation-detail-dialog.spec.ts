import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationDetailDialog } from './solicitation-detail-dialog';

describe('SolicitationDetailDialog', () => {
  let component: SolicitationDetailDialog;
  let fixture: ComponentFixture<SolicitationDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitationDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
