import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDialog } from './maintenance-dialog';

describe('MaintenanceDialog', () => {
  let component: MaintenanceDialog;
  let fixture: ComponentFixture<MaintenanceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
