import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Solicitation, RequestStatus } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-solicitation-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './solicitation-detail-dialog.html',
})
export class SolicitationDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SolicitationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: Solicitation },
  ) {}

  getStatusLabel(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      [RequestStatus.OPEN]:        'Aberta',
      [RequestStatus.QUOTED]:      'Orçada',
      [RequestStatus.APPROVED]:    'Aprovada',
      [RequestStatus.REJECTED]:    'Rejeitada',
      [RequestStatus.IN_PROGRESS]: 'Em Andamento',
      [RequestStatus.FIXED]:       'Arrumada',
      [RequestStatus.PAID]:        'Paga',
      [RequestStatus.FINALIZED]:   'Finalizada',
      [RequestStatus.REDIRECTED]:  'Redirecionada',
    };
    return map[status] || status;
  }

  onClose(): void { this.dialogRef.close(); }
}