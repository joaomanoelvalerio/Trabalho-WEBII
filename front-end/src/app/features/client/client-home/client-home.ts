import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';

interface StatusMeta { label: string; badgeClass: string; }

const SHORT_DESC_LIMIT = 30;

const STATUS_META: Record<RequestStatus, StatusMeta> = {
  [RequestStatus.OPEN]:        { label: 'Aberta',        badgeClass: 'bg-secondary'             },
  [RequestStatus.QUOTED]:      { label: 'Orçada',        badgeClass: 'bg-warning text-dark'     },
  [RequestStatus.APPROVED]:    { label: 'Aprovada',      badgeClass: 'bg-success'               },
  [RequestStatus.REJECTED]:    { label: 'Rejeitada',     badgeClass: 'bg-danger'                },
  [RequestStatus.IN_PROGRESS]: { label: 'Em Andamento',  badgeClass: 'bg-primary'               },
  [RequestStatus.FIXED]:       { label: 'Arrumada',      badgeClass: 'bg-info text-dark'        },
  [RequestStatus.PAID]:        { label: 'Paga',          badgeClass: 'bg-success bg-opacity-75' },
  [RequestStatus.FINALIZED]:   { label: 'Finalizada',    badgeClass: 'bg-dark'                  },
  [RequestStatus.REDIRECTED]:  { label: 'Redirecionada', badgeClass: 'bg-secondary'             },
};

const STATUSES_WITH_DEDICATED_ACTION = new Set<RequestStatus>([
  RequestStatus.QUOTED, RequestStatus.REJECTED,
  RequestStatus.FIXED,  RequestStatus.APPROVED,
]);

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
})
export class ClientHomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);

  requests: Solicitation[] = [];
  showQuoteModal = false;
  selectedRequest: Solicitation | null = null;
  rejectionReason = '';

  ngOnInit(): void { this.loadRequests(); }

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

  onNewRequest(): void { this.router.navigate(['/client/new-request']); }

  onViewRequest(req: Solicitation): void {
    this.selectedRequest = req;
    this.showQuoteModal = false;
  }

  onApproveRejectQuote(req: Solicitation): void {
    this.selectedRequest = req;
    this.showQuoteModal = true;
    this.rejectionReason = '';
  }

  closeModal(): void {
    this.selectedRequest = null;
    this.showQuoteModal = false;
  }

  onApprove(): void {
    if (!this.selectedRequest) return;
    const req = this.selectedRequest;
    const now = new Date().toISOString();
    const history = [...(req.history || []), {
      date: now, fromStatus: req.status, toStatus: RequestStatus.APPROVED,
      note: `Orçamento aprovado: R$ ${req.quoteValue?.toFixed(2).replace('.', ',')}`,
    }];
    this.storageService.updateRequest(req.id, { status: RequestStatus.APPROVED, history });
    alert(`Serviço Aprovado no Valor R$ ${req.quoteValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    this.closeModal();
    this.loadRequests();
  }

  onReject(): void {
    if (!this.selectedRequest || !this.rejectionReason.trim()) return;
    const req = this.selectedRequest;
    const now = new Date().toISOString();
    const history = [...(req.history || []), {
      date: now, fromStatus: req.status, toStatus: RequestStatus.REJECTED,
      note: `Rejeitado: ${this.rejectionReason.trim()}`,
    }];
    this.storageService.updateRequest(req.id, {
      status: RequestStatus.REJECTED,
      rejectionReason: this.rejectionReason.trim(),
      history,
    });
    alert('Serviço Rejeitado');
    this.closeModal();
    this.loadRequests();
  }

  onRescueService(req: Solicitation): void {
    if (!confirm('Deseja resgatar este serviço? Ele voltará ao estado Aprovada.')) return;
    const now = new Date().toISOString();
    const history = [...(req.history || []), {
      date: now, fromStatus: RequestStatus.REJECTED, toStatus: RequestStatus.APPROVED,
      note: 'Serviço resgatado pelo cliente (Rejeitada → Aprovada)',
    }];
    this.storageService.updateRequest(req.id, { status: RequestStatus.APPROVED, history });
    this.loadRequests();
  }

  onPayService(req: Solicitation): void {
    if (!confirm(`Confirma o pagamento de R$ ${req.quoteValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}?`)) return;
    const now = new Date().toISOString();
    const history = [...(req.history || []), {
      date: now, fromStatus: RequestStatus.FIXED, toStatus: RequestStatus.PAID,
      note: 'Pagamento efetuado pelo cliente',
    }];
    this.storageService.updateRequest(req.id, { status: RequestStatus.PAID, paidAt: now, history });
    this.loadRequests();
  }
}
