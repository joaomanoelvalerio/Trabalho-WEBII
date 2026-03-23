import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type RequestStatus =
  | 'OPEN'
  | 'QUOTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FIXED'
  | 'PAID'
  | 'FINALIZED';

export interface EmployeeRequest {
  id: number;
  dateTime: Date;
  clientName: string;
  description: string;
  status: RequestStatus;
}

const SHORT_DESC_LIMIT = 30;

@Component({
  selector: 'app-employee',
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {

  requests: EmployeeRequest[] = [
    { id: 1, dateTime: new Date(), clientName: 'João Silva',  description: 'Notebook Dell não liga após queda',   status: 'OPEN' },
    { id: 2, dateTime: new Date(), clientName: 'Maria Souza', description: 'Celular Samsung com tela quebrada',   status: 'OPEN' },
  ];

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length <= SHORT_DESC_LIMIT
      ? description
      : description.substring(0, SHORT_DESC_LIMIT) + '...';
  }

  submitQuote(id: number): void {
    console.log('Submit quote for request:', id);
  }
}