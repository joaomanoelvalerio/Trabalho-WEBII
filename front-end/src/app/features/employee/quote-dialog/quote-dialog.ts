import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-quote-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './quote-dialog.html',
})
export class QuoteDialogComponent {
  readonly data: { request: Solicitation } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<QuoteDialogComponent>);

  displayValue = '';
  quoteValue = 0;

  onValueChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (!raw) {
      this.displayValue = '';
      this.quoteValue = 0;
      return;
    }
    this.quoteValue = parseInt(raw, 10) / 100;
    this.displayValue = this.quoteValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.dialogRef.close(this.quoteValue);
  }
}