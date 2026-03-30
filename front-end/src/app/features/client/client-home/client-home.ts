import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { StorageService } from '../../../shared/services/storage';

export type RequestStatus =
  | 'OPEN'
  | 'QUOTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FIXED'
  | 'PAID'
  | 'FINALIZED'
  | 'REDIRECTED';

export interface ServiceRequest {
  id: number;
  openedAt: Date;
  equipmentDescription: string;
  status: RequestStatus;
}

export interface StatusMeta {
  label: string;
  cssClass: string;
  icon: string;
}

const SHORT_DESC_LIMIT = 30;

const STATUS_META: Record<RequestStatus, StatusMeta> = {
  OPEN: { label: 'Aberta', cssClass: 'chip-open', icon: 'radio_button_unchecked' },
  QUOTED: { label: 'Orçada', cssClass: 'chip-quoted', icon: 'receipt_long' },
  APPROVED: { label: 'Aprovada', cssClass: 'chip-approved', icon: 'check_circle' },
  REJECTED: { label: 'Rejeitada', cssClass: 'chip-rejected', icon: 'cancel' },
  FIXED: { label: 'Consertada', cssClass: 'chip-fixed', icon: 'build_circle' },
  PAID: { label: 'Paga', cssClass: 'chip-paid', icon: 'payments' },
  FINALIZED: { label: 'Finalizada', cssClass: 'chip-finalized', icon: 'task_alt' },
  REDIRECTED: { label: 'Redirecionada', cssClass: 'chip-redirected', icon: 'swap_horiz' },
};

const STATUSES_WITH_DEDICATED_ACTION = new Set<RequestStatus>([
  'QUOTED',
  'REJECTED',
  'FIXED',
  'APPROVED',
]);

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
})
export class ClientHomeComponent implements OnInit {
  private router = inject(Router);
  private storageService = inject(StorageService);

  readonly displayedColumns: string[] = ['openedAt', 'equipmentDescription', 'status', 'actions'];

  requests: any[] = [];
  // requests: ServiceRequest[] = [
  //   {
  //     id: 1,
  //     openedAt: new Date('2024-03-01T10:00:00'),
  //     equipmentDescription: 'Dell Inspiron Notebook – Cracked Screen',
  //     status: 'OPEN',
  //   },
  //   {
  //     id: 2,
  //     openedAt: new Date('2024-03-02T14:30:00'),
  //     equipmentDescription: 'HP LaserJet Printer – Paper Jam',
  //     status: 'QUOTED',
  //   },
  //   {
  //     id: 3,
  //     openedAt: new Date('2024-03-05T09:15:00'),
  //     equipmentDescription: 'Gaming Desktop – Full Cleaning & Thermal Paste',
  //     status: 'REJECTED',
  //   },
  //   {
  //     id: 4,
  //     openedAt: new Date('2024-03-07T16:00:00'),
  //     equipmentDescription: 'LG Monitor – No Power After Outage',
  //     status: 'FIXED',
  //   },
  //   {
  //     id: 5,
  //     openedAt: new Date('2024-03-08T11:00:00'),
  //     equipmentDescription: 'Lenovo ThinkPad – Keyboard Replacement',
  //     status: 'APPROVED',
  //   },
  // ];

  ngOnInit(): void {
    this.requests = this.storageService.getSolicitacoes();

    this.requests.forEach((req) => (req.openedAt = new Date(req.openedAt)));
    this.requests.sort((a, b) => a.openedAt.getTime() - b.openedAt.getTime());
  }

  getStatusMeta(status: RequestStatus): StatusMeta {
    return STATUS_META[status];
  }

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length <= SHORT_DESC_LIMIT
      ? description
      : description.substring(0, SHORT_DESC_LIMIT) + '...';
  }

  isTruncated(description: string): boolean {
    return description.length > SHORT_DESC_LIMIT;
  }

  showViewButton(status: RequestStatus): boolean {
    return !STATUSES_WITH_DEDICATED_ACTION.has(status);
  }

  onNewRequest(): void {
    this.router.navigate(['/client/new-request']);
  }

  onViewRequest(req: ServiceRequest): void {
    console.log('view request', req.id);
  }

  onApproveRejectQuote(req: ServiceRequest): void {
    console.log('approve/reject quote', req.id);
  }

  onRescueService(req: ServiceRequest): void {
    console.log('rescue request', req.id);
  }

  onPayService(req: ServiceRequest): void {
    console.log('pay request', req.id);
  }
}
