import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-pay-service-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './pay-service-dialog.html',
})
export class PayServiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PayServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: Solicitation },
  ) {}

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void  { this.dialogRef.close(false); }
}