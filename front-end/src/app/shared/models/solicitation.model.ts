export enum RequestStatus {
  OPEN = 'OPEN',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FIXED = 'FIXED',
  PAID = 'PAID',
  FINALIZED = 'FINALIZED',
  REDIRECTED = 'REDIRECTED',
}

export interface HistoryEntry {
  date: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  employeeId?: number;
  employeeName?: string;
  note?: string;
}

export interface Solicitation {
  id: number;
  openedAt: string;
  equipmentDescription: string;
  categoryId?: number;
  defectDescription: string;
  status: RequestStatus;
  clientId: number;
  quoteValue?: number;
  quotedByEmployeeId?: number;
  quotedAt?: string;
  rejectionReason?: string;
  maintenanceDescription?: string;
  clientOrientations?: string;
  maintainedByEmployeeId?: number;
  maintainedAt?: string;
  redirectedToEmployeeId?: number;
  finalizedByEmployeeId?: number;
  finalizedAt?: string;
  paidAt?: string;
  history: HistoryEntry[];
  clientName?: string;
  categoryName?: string;
  quotedByEmployeeName?: string;
  maintainedByEmployeeName?: string;
  redirectedToEmployeeName?: string;
  finalizedByEmployeeName?: string;
}