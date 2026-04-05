import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-pay-service-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './pay-service-dialog.html',
})
export class PayServiceDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<PayServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: Solicitation },
  ) {}

  /** Formata o valor sem depender do pipe currency + locale pt-BR */
  formatCurrency(value?: number): string {
    if (value == null) return 'R$ —';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onCancel(): void  { this.dialogRef.close(false); }
  onConfirm(): void { this.dialogRef.close(true); }
}