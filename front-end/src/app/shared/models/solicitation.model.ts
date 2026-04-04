export enum RequestStatus {
  OPEN = 'OPEN',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
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
  categoryName?: string;
  defectDescription: string;
  status: RequestStatus;
  clientId: number;
  clientName?: string;
  quoteValue?: number;
  quotedByEmployeeId?: number;
  quotedByEmployeeName?: string;
  quotedAt?: string;
  rejectionReason?: string;
  maintenanceDescription?: string;
  clientOrientations?: string;
  maintainedByEmployeeId?: number;
  maintainedByEmployeeName?: string;
  maintainedAt?: string;
  redirectedToEmployeeId?: number;
  redirectedToEmployeeName?: string;
  finalizedByEmployeeId?: number;
  finalizedByEmployeeName?: string;
  finalizedAt?: string;
  paidAt?: string;
  history: HistoryEntry[];
}
