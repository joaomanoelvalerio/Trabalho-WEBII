import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';

interface StatusMeta {
  label: string;
  badgeClass: string;
}

const SHORT_DESC_LIMIT = 30;

const STATUS_META: Record<RequestStatus, StatusMeta> = {
  [RequestStatus.OPEN]: {
    label: 'Aberta',
    badgeClass: 'bg-secondary',
  },
  [RequestStatus.QUOTED]: {
    label: 'Orçada',
    badgeClass: 'bg-warning text-dark',
  },
  [RequestStatus.APPROVED]: {
    label: 'Aprovada',
    badgeClass: 'bg-success',
  },
  [RequestStatus.REJECTED]: {
    label: 'Rejeitada',
    badgeClass: 'bg-danger',
  },
  [RequestStatus.IN_PROGRESS]: {
    label: 'Em Andamento',
    badgeClass: 'bg-primary',
  },
  [RequestStatus.FIXED]: {
    label: 'Consertada',
    badgeClass: 'bg-info text-dark',
  },
  [RequestStatus.PAID]: {
    label: 'Paga',
    badgeClass: 'bg-success bg-opacity-75',
  },
  [RequestStatus.FINALIZED]: {
    label: 'Finalizada',
    badgeClass: 'bg-dark',
  },
  [RequestStatus.REDIRECTED]: {
    label: 'Redirecionada',
    badgeClass: 'bg-secondary',
  },
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
  imports: [CommonModule],
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
})
export class ClientHomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);

  requests: Solicitation[] = [];

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (!user) return;

    this.requests = this.storageService
      .getRequestsByClientId(user.id)
      .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
  }

  getStatusMeta(status: RequestStatus): StatusMeta {
    return (
      STATUS_META[status] ?? {
        label: 'Desconhecido',
        badgeClass: 'bg-secondary',
      }
    );
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
    console.log('view', req.id);
  }

  onApproveRejectQuote(req: Solicitation): void {
    console.log('quote', req.id);
  }

  onRescueService(req: Solicitation): void {
    console.log('rescue', req.id);
  }

  onPayService(req: Solicitation): void {
    console.log('pay', req.id);
  }
}
