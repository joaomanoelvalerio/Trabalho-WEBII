import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-finalize-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './finalize-dialog.html',
})
export class FinalizeDialogComponent {
  readonly data: { request: Solicitation } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FinalizeDialogComponent>);

  /** Formata o valor sem depender do pipe currency + locale pt-BR */
  formatCurrency(value?: number): string {
    if (value == null) return 'R$ —';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onCancel(): void  { this.dialogRef.close(false); }
  onConfirm(): void { this.dialogRef.close(true); }
}