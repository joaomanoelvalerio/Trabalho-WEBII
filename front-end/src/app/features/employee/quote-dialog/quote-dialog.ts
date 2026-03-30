import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeRequest } from '../employee';

@Component({
  selector: 'app-quote-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './quote-dialog.html',
})
export class QuoteDialogComponent {
  readonly data: { request: EmployeeRequest } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<QuoteDialogComponent>);

  displayValue: string = '';
  quoteValue: number = 0;

  onValueChange(event: any): void {
    let value = event.target.value;
    
    value = value.replace(/\D/g, '');
    
    if (value === '') {
      this.displayValue = '';
      this.quoteValue = 0;
      return;
    }

    const numericValue = parseInt(value, 10) / 100;
    this.quoteValue = numericValue;

    this.displayValue = numericValue.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.dialogRef.close(this.quoteValue);
  }
}