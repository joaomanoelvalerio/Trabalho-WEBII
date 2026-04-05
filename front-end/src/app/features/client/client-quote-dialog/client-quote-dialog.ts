import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-client-quote-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './client-quote-dialog.html',
})
export class ClientQuoteDialogComponent {
  isRejecting = false;
  motivoRejeicao = '';

  constructor(
    public dialogRef: MatDialogRef<ClientQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: any },
  ) {}

  /** Formata o valor sem depender do pipe currency + locale pt-BR */
  formatCurrency(value?: number): string {
    if (value == null) return 'R$ —';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onApprove(): void {
    this.dialogRef.close({ action: 'APPROVE' });
  }

  onReject(): void {
    this.isRejecting = true;
  }

  onConfirmReject(): void {
    if (this.motivoRejeicao.trim()) {
      this.dialogRef.close({ action: 'REJECT', reason: this.motivoRejeicao });
    }
  }

  onCancelReject(): void {
    this.isRejecting = false;
    this.motivoRejeicao = '';
  }
}