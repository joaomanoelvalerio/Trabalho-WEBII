export enum RequestStatus {
  OPEN        = 'OPEN',
  QUOTED      = 'QUOTED',
  APPROVED    = 'APPROVED',
  REJECTED    = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FIXED       = 'FIXED',
  PAID        = 'PAID',
  FINALIZED   = 'FINALIZED',
  REDIRECTED  = 'REDIRECTED',
}

export interface Solicitation {
  id: number;
  openedAt: string;
  equipmentDescription: string;
  defectDescription: string;
  status: RequestStatus;
  clientId: number;
  clientName?: string;     
}