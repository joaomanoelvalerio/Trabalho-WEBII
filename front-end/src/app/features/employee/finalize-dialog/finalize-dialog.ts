import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-finalize-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './finalize-dialog.html',
})
export class FinalizeDialogComponent {
  readonly data: { request: Solicitation } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FinalizeDialogComponent>);

  onCancel(): void  { this.dialogRef.close(false); }
  onConfirm(): void { this.dialogRef.close(true); }
}
