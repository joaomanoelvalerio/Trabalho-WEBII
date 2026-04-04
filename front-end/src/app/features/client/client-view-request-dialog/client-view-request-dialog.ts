import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Solicitation, RequestStatus } from '../../../shared/models/solicitation.model';

@Component({
  selector: 'app-client-view-request-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, FormsModule],
  templateUrl: './client-view-request-dialog.html',
})
export class ClientViewRequestDialogComponent {
  isRejecting: boolean = false;
  rejectionReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ClientViewRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: Solicitation },
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onAction(actionType: string): void {
    if (actionType === 'REJECT_INTENT') {
      this.isRejecting = true;
      return;
    }
    if (actionType === 'CANCEL_REJECT') {
      this.isRejecting = false;
      this.rejectionReason = '';
      return;
    }
    if (actionType === 'CONFIRM_REJECT') {
      if (this.rejectionReason.trim()) {
        this.dialogRef.close({
          action: 'REJECT',
          reason: this.rejectionReason,
        });
      }
      return;
    }

    this.dialogRef.close({ action: actionType });
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
