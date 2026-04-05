import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';
import { MatDialog } from '@angular/material/dialog';
import { ClientQuoteDialogComponent } from '../client-quote-dialog/client-quote-dialog';
import { ClientViewRequestDialogComponent } from '../client-view-request-dialog/client-view-request-dialog';
import { PayServiceDialogComponent } from '../pay-service-dialog/pay-service-dialog';

interface StatusMeta {
  label: string;
  badgeClass: string;
}

const SHORT_DESC_LIMIT = 30;

const STATUS_META: Record<RequestStatus, StatusMeta> = {
  [RequestStatus.OPEN]:        { label: 'Aberta',        badgeClass: 'bg-secondary' },
  [RequestStatus.QUOTED]:      { label: 'Orçada',        badgeClass: 'bg-warning text-dark' },
  [RequestStatus.APPROVED]:    { label: 'Aprovada',      badgeClass: 'bg-success' },
  [RequestStatus.REJECTED]:    { label: 'Rejeitada',     badgeClass: 'bg-danger' },
  [RequestStatus.IN_PROGRESS]: { label: 'Em Andamento',  badgeClass: 'bg-primary' },
  [RequestStatus.FIXED]:       { label: 'Arrumada',      badgeClass: 'bg-info text-dark' },
  [RequestStatus.PAID]:        { label: 'Paga',          badgeClass: 'bg-success bg-opacity-75' },
  [RequestStatus.FINALIZED]:   { label: 'Finalizada',    badgeClass: 'bg-dark' },
  [RequestStatus.REDIRECTED]:  { label: 'Redirecionada', badgeClass: 'bg-secondary' },
};

const STATUSES_WITH_DEDICATED_ACTION = new Set<RequestStatus>([
  RequestStatus.QUOTED,
  RequestStatus.REJECTED,
  RequestStatus.FIXED,
  RequestStatus.APPROVED,
]);

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
})
export class ClientHomeComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);

  requests: Solicitation[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const user = this.authService.getLoggedInUser();
    if (!user) return;
    this.requests = this.storageService
      .getRequestsByClientId(user.id)
      .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
  }

  getStatusMeta(status: RequestStatus): StatusMeta {
    return STATUS_META[status] ?? { label: 'Desconhecido', badgeClass: 'bg-secondary' };
  }

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length <= SHORT_DESC_LIMIT
      ? description
      : description.substring(0, SHORT_DESC_LIMIT - 3) + '...';
  }

  isTruncated(description: string): boolean {
    return description?.length > SHORT_DESC_LIMIT;
  }

  showViewButton(status: RequestStatus): boolean {
    return !STATUSES_WITH_DEDICATED_ACTION.has(status);
  }

  onNewRequest(): void {
    this.router.navigate(['/client/new-request']);
  }

  onViewRequest(req: Solicitation): void {
    this.dialog.open(ClientViewRequestDialogComponent, {
      width: '600px',
      data: { request: req, viewOnly: true },
    });
  }

  onApproveRejectQuote(req: Solicitation): void {
    const dialogRef = this.dialog.open(ClientQuoteDialogComponent, {
      width: '500px',
      data: { request: req },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const updatedReq = { ...req };
      const now = new Date().toISOString();

      if (result.action === 'APPROVE') {
        updatedReq.status = RequestStatus.APPROVED;
        updatedReq.history = [...(req.history || []), {
          date: now,
          fromStatus: req.status,
          toStatus: RequestStatus.APPROVED,
          note: `Orçamento aprovado pelo cliente. Valor: R$ ${req.quoteValue || 0}`,
        } as any];
        this.storageService.updateRequest(updatedReq.id, updatedReq);
        alert(`Serviço Aprovado no Valor R$ ${req.quoteValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

      } else if (result.action === 'REJECT') {
        updatedReq.status = RequestStatus.REJECTED;
        updatedReq.rejectionReason = result.reason;
        updatedReq.history = [...(req.history || []), {
          date: now,
          fromStatus: req.status,
          toStatus: RequestStatus.REJECTED,
          note: `Orçamento rejeitado pelo cliente. Motivo: ${result.reason}`,
        } as any];
        this.storageService.updateRequest(updatedReq.id, updatedReq);
        alert('Serviço Rejeitado');
      }

      this.loadRequests();
    });
  }

  onRescueService(req: Solicitation): void {
    const confirmed = confirm('Deseja resgatar este serviço? A solicitação voltará para o estado APROVADA.');
    if (!confirmed) return;

    const now = new Date().toISOString();
    this.storageService.updateRequest(req.id, {
      status: RequestStatus.APPROVED,
      history: [
        ...(req.history || []),
        {
          date: now,
          fromStatus: RequestStatus.REJECTED,
          toStatus: RequestStatus.APPROVED,
          note: 'Serviço resgatado pelo cliente (Rejeitada → Aprovada)',
        },
      ],
    });
    this.loadRequests();
  }

  onPayService(req: Solicitation): void {
    const dialogRef = this.dialog.open(PayServiceDialogComponent, {
      width: '520px',
      data: { request: req },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const now = new Date().toISOString();
      this.storageService.updateRequest(req.id, {
        status: RequestStatus.PAID,
        paidAt: now,
        history: [
          ...(req.history || []),
          {
            date: now,
            fromStatus: RequestStatus.FIXED,
            toStatus: RequestStatus.PAID,
            note: `Pagamento efetuado pelo cliente. Valor: R$ ${req.quoteValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          },
        ],
      });
      alert('Pagamento confirmado!');
      this.loadRequests();
    });
  }
}