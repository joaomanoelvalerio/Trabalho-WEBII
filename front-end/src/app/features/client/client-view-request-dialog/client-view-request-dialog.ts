import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Solicitation, RequestStatus } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-client-view-request-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './client-view-request-dialog.html',
})
export class ClientViewRequestDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ClientViewRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: Solicitation },
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusLabel(status: RequestStatus): string {
    const statusMap: Record<RequestStatus, string> = {
      [RequestStatus.OPEN]: 'Aberta',
      [RequestStatus.QUOTED]: 'Orçada',
      [RequestStatus.APPROVED]: 'Aprovada',
      [RequestStatus.REJECTED]: 'Rejeitada',
      [RequestStatus.IN_PROGRESS]: 'Em Andamento',
      [RequestStatus.FIXED]: 'Consertada',
      [RequestStatus.PAID]: 'Paga',
      [RequestStatus.FINALIZED]: 'Finalizada',
      [RequestStatus.REDIRECTED]: 'Redirecionada',
    };
    return statusMap[status] || 'Desconhecido';
  }
}
