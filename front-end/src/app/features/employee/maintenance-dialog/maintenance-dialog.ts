import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Solicitation } from '../../../shared/models/solicitation.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-maintenance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './maintenance-dialog.html',
})
export class MaintenanceDialogComponent {
  readonly data: { request: Solicitation; employees: User[] } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MaintenanceDialogComponent>);

  mode: 'CHOOSE' | 'MAINTAIN' | 'REDIRECT' = 'CHOOSE';

  maintenanceDescription = '';
  clientOrientations = '';
  targetEmployeeId: number | null = null;

  /** Formata o valor sem depender do pipe currency + locale pt-BR */
  formatCurrency(value?: number): string {
    if (value == null) return 'R$ —';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onCancel(): void { this.dialogRef.close(null); }

  onConfirmMaintain(): void {
    if (!this.maintenanceDescription.trim()) return;
    this.dialogRef.close({
      action: 'MAINTAIN',
      maintenanceDescription: this.maintenanceDescription.trim(),
      clientOrientations: this.clientOrientations.trim(),
    });
  }

  onConfirmRedirect(): void {
    if (!this.targetEmployeeId) return;
    this.dialogRef.close({ action: 'REDIRECT', targetEmployeeId: this.targetEmployeeId });
  }
}