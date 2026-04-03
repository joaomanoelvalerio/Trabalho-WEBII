import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly REQUESTS_KEY = 'manutencao_requests';

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const data = localStorage.getItem(this.REQUESTS_KEY);

    if (!data) {
      const mock = [
        {
          id: 1,
          openedAt: new Date('2024-03-01T10:00:00'),
          equipmentDescription: 'Dell Inspiron Notebook - Tela trincada',
          defectDescription: 'Tela com trincas após queda.',
          categoryId: 1,
          status: 'OPEN',
        },
        {
          id: 2,
          openedAt: new Date('2024-03-02T14:30:00'),
          equipmentDescription: 'HP LaserJet Printer - Atolamento de papel',
          defectDescription: 'Papel prende toda vez que imprime.',
          categoryId: 3,
          status: 'QUOTED',
        },
      ];

      localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(mock));
    }
  }

  getRequests(): any[] {
    const data = localStorage.getItem(this.REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveRequest(newRequest: any): void {
    const requests = this.getRequests();

    const request = {
      id: requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
      openedAt: new Date(),
      equipmentDescription: newRequest.equipmentDescription,
      defectDescription: newRequest.defectDescription,
      categoryId: newRequest.categoryId,
      status: 'OPEN',
    };

    requests.push(request);
    localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
  }

  updateRequestStatus(id: number, status: string): void {
    const requests = this.getRequests();
    const request = requests.find((r) => r.id === id);
    if (request) {
      request.status = status;
      localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
    }
  }
}