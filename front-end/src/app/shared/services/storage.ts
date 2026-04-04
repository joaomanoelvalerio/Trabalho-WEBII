import { Injectable } from '@angular/core';
import { Solicitation, RequestStatus } from '../models/solicitation.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = 'manutencao_requests';

  constructor() {
    this.seedMockData();
  }

  private seedMockData(): void {
    if (localStorage.getItem(this.KEY)) return;

    const mock: Solicitation[] = [
      {
        id: 1,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-01T10:00:00',
        equipmentDescription: 'Dell Inspiron Notebook - Tela trincada',
        defectDescription: 'Tela com trincas após queda no chão.',
        status: RequestStatus.OPEN,
      },
      {
        id: 2,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-02T14:30:00',
        equipmentDescription: 'HP LaserJet Printer - Atolamento de papel',
        defectDescription: 'Papel prende toda vez que tenta imprimir.',
        status: RequestStatus.QUOTED,
      },
      {
        id: 3,
        clientId: 4,
        clientName: 'José Cliente',
        openedAt: '2024-03-03T09:00:00',
        equipmentDescription: 'Desktop Gamer - Não liga após queda de energia',
        defectDescription: 'Computador não liga mais após queda de energia.',
        status: RequestStatus.APPROVED,
      },
      {
        id: 4,
        clientId: 4,
        clientName: 'José Cliente',
        openedAt: '2024-03-04T11:00:00',
        equipmentDescription: 'Monitor LG - Tela piscando',
        defectDescription: 'Tela pisca constantemente ao ligar.',
        status: RequestStatus.FIXED,
      },
      {
        id: 5,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-05T16:00:00',
        equipmentDescription: 'Teclado Mecânico - Teclas travando',
        defectDescription: 'Diversas teclas travando ao digitar.',
        status: RequestStatus.REJECTED,
      },
    ];

    localStorage.setItem(this.KEY, JSON.stringify(mock));
  }

  getRequests(): Solicitation[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  getRequestsByClientId(clientId: number): Solicitation[] {
    return this.getRequests().filter((r) => r.clientId === clientId);
  }

  getOpenRequests(): Solicitation[] {
    return this.getRequests().filter((r) => r.status === RequestStatus.OPEN);
  }

  saveRequest(data: Omit<Solicitation, 'id'>): Solicitation {
    const requests = this.getRequests();
    const newRequest: Solicitation = {
      ...data,
      id: requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
    };
    requests.push(newRequest);
    localStorage.setItem(this.KEY, JSON.stringify(requests));
    return newRequest;
  }

  updateRequestStatus(id: number, status: RequestStatus): void {
    const requests = this.getRequests();
    const request = requests.find((r) => r.id === id);
    if (!request) throw new Error('Solicitação não encontrada.');
    request.status = status;
    localStorage.setItem(this.KEY, JSON.stringify(requests));
  }
}
