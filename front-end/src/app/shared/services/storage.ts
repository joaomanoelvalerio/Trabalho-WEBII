import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly REQUESTS_KEY = 'manutencao_requests';

  constructor() {
    this.inicializarDados();
  }

  private inicializarDados(): void {
    const dados = localStorage.getItem(this.REQUESTS_KEY);

    if (!dados) {
      const mockInicial = [
        {
          id: 1,
          openedAt: new Date('2024-03-01T10:00:00'),
          equipmentDescription: 'Dell Inspiron Notebook - Tela trincada',
          status: 'OPEN',
        },
        {
          id: 2,
          openedAt: new Date('2024-03-02T14:30:00'),
          equipmentDescription: 'HP LaserJet Printer - Atolamento de papel',
          status: 'QUOTED',
        },
      ];

      localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(mockInicial));
    }
  }

  getSolicitacoes(): any[] {
    const dados = localStorage.getItem(this.REQUESTS_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  salvarSolicitacao(novaSolicitacao: any): void {
    const solicitacoes = this.getSolicitacoes();

    const nova = {
      id: solicitacoes.length > 0 ? Math.max(...solicitacoes.map((s) => s.id)) + 1 : 1,
      openedAt: new Date(),
      equipmentDescription: novaSolicitacao.descricaoEquipamento,
      status: 'OPEN',
      categoria: novaSolicitacao.categoria,
      descricaoDefeito: novaSolicitacao.descricaoDefeito,
    };

    solicitacoes.push(nova);

    localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(solicitacoes));
  }
}
