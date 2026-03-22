import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';

import { MatTableModule }   from '@angular/material/table';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatChipsModule }   from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule }    from '@angular/material/card';


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
  OPEN:       { label: 'Open',       cssClass: 'chip-open',       icon: 'radio_button_unchecked' },
  QUOTED:     { label: 'Quoted',     cssClass: 'chip-quoted',     icon: 'receipt_long'           },
  APPROVED:   { label: 'Approved',   cssClass: 'chip-approved',   icon: 'check_circle'           },
  REJECTED:   { label: 'Rejected',   cssClass: 'chip-rejected',   icon: 'cancel'                 },
  FIXED:      { label: 'Fixed',      cssClass: 'chip-fixed',      icon: 'build_circle'           },
  PAID:       { label: 'Paid',       cssClass: 'chip-paid',       icon: 'payments'               },
  FINALIZED:  { label: 'Finalized',  cssClass: 'chip-finalized',  icon: 'task_alt'               },
  REDIRECTED: { label: 'Redirected', cssClass: 'chip-redirected', icon: 'swap_horiz'             },
};

const STATUSES_WITH_DEDICATED_ACTION = new Set<RequestStatus>([
  'QUOTED', 'REJECTED', 'FIXED', 'APPROVED',
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

  readonly displayedColumns: string[] = ['openedAt', 'equipmentDescription', 'status', 'actions'];

  requests: ServiceRequest[] = [
    { id: 1, openedAt: new Date('2024-03-01T10:00:00'), equipmentDescription: 'Dell Inspiron Notebook – Cracked Screen',        status: 'OPEN'     },
    { id: 2, openedAt: new Date('2024-03-02T14:30:00'), equipmentDescription: 'HP LaserJet Printer – Paper Jam',                status: 'QUOTED'   },
    { id: 3, openedAt: new Date('2024-03-05T09:15:00'), equipmentDescription: 'Gaming Desktop – Full Cleaning & Thermal Paste', status: 'REJECTED' },
    { id: 4, openedAt: new Date('2024-03-07T16:00:00'), equipmentDescription: 'LG Monitor – No Power After Outage',             status: 'FIXED'    },
    { id: 5, openedAt: new Date('2024-03-08T11:00:00'), equipmentDescription: 'Lenovo ThinkPad – Keyboard Replacement',         status: 'APPROVED' },
  ];

  ngOnInit(): void {
    this.requests.sort((a, b) => a.openedAt.getTime() - b.openedAt.getTime());
  }

  getStatusMeta(status: RequestStatus): StatusMeta {
    return STATUS_META[status];
  }

  getShortDescription(description: string): string {
    return description.length > SHORT_DESC_LIMIT
      ? `${description.substring(0, SHORT_DESC_LIMIT - 3)}...`
      : description;
  }

  isTruncated(description: string): boolean {
    return description.length > SHORT_DESC_LIMIT;
  }

  showViewButton(status: RequestStatus): boolean {
    return !STATUSES_WITH_DEDICATED_ACTION.has(status);
  }

  onNewRequest(): void {
    console.log('RF004 — new request');
  }

  onViewRequest(req: ServiceRequest): void {
    console.log('RF008 — view request', req.id);
  }

  onApproveRejectQuote(req: ServiceRequest): void {
    console.log('RF005 — quote for request', req.id);
  }

  onRescueService(req: ServiceRequest): void {
    console.log('RF009 — rescue request', req.id);
  }

  onPayService(req: ServiceRequest): void {
    console.log('RF010 — pay request', req.id);
  }
}