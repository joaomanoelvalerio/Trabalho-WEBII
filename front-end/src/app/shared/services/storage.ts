import { Injectable } from '@angular/core';
import { Solicitation, RequestStatus, HistoryEntry } from '../models/solicitation.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = 'maintenance_requests';

  constructor() {
    this.seedMockData();
  }

  private h(
    toStatus: RequestStatus,
    date: string,
    employeeId?: number,
    employeeName?: string,
    note?: string,
    fromStatus: RequestStatus | null = null
  ): HistoryEntry {
    return { date, fromStatus, toStatus, employeeId, employeeName, note };
  }

  private seedMockData(): void {
    if (localStorage.getItem(this.KEY)) return;

    const mock: Solicitation[] = [
      {
        id: 1,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-01T10:00:00',
        equipmentDescription: 'Dell Inspiron - Tela trincada',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Tela com trincas após queda no chão.',
        status: RequestStatus.OPEN,
        history: [
          this.h(RequestStatus.OPEN, '2024-03-01T10:00:00', undefined, undefined, 'Solicitação aberta pelo cliente'),
        ],
      },
      {
        id: 2,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-02T14:30:00',
        equipmentDescription: 'HP LaserJet - Atolamento de papel',
        categoryId: 3, categoryName: 'Impressora',
        defectDescription: 'Papel prende toda vez que tenta imprimir.',
        status: RequestStatus.QUOTED,
        quoteValue: 350.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-03T09:00:00',
        history: [
          this.h(RequestStatus.OPEN,   '2024-03-02T14:30:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED, '2024-03-03T09:00:00', 1, 'Maria Silva', 'Orçamento de R$ 350,00', RequestStatus.OPEN),
        ],
      },
      {
        id: 3,
        clientId: 4,
        clientName: 'José Cliente',
        openedAt: '2024-03-03T09:00:00',
        equipmentDescription: 'Desktop Gamer - Não liga',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'Computador não liga após queda de energia.',
        status: RequestStatus.APPROVED,
        quoteValue: 580.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-04T08:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-03T09:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-04T08:00:00', 2, 'Mário Santos', 'Orçamento de R$ 580,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-04T16:00:00', undefined, undefined, 'Cliente aprovou o orçamento', RequestStatus.QUOTED),
        ],
      },
      {
        id: 4,
        clientId: 4,
        clientName: 'José Cliente',
        openedAt: '2024-03-04T11:00:00',
        equipmentDescription: 'Monitor LG - Tela piscando',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'Tela pisca constantemente ao ligar.',
        status: RequestStatus.FIXED,
        quoteValue: 200.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-05T08:30:00',
        maintenanceDescription: 'Substituição do cabo de vídeo interno danificado.',
        clientOrientations: 'Evitar dobrar o cabo ao fechar o monitor.',
        maintainedByEmployeeId: 1, maintainedByEmployeeName: 'Maria Silva',
        maintainedAt: '2024-03-07T14:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-04T11:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-05T08:30:00', 1, 'Maria Silva', 'Orçamento de R$ 200,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-05T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,    '2024-03-07T14:00:00', 1, 'Maria Silva', 'Manutenção concluída', RequestStatus.APPROVED),
        ],
      },
      {
        id: 5,
        clientId: 3,
        clientName: 'João Cliente',
        openedAt: '2024-03-05T16:00:00',
        equipmentDescription: 'Teclado Mecânico - Teclas travando',
        categoryId: 4, categoryName: 'Teclado',
        defectDescription: 'Diversas teclas travando ao digitar.',
        status: RequestStatus.REJECTED,
        quoteValue: 450.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-06T09:00:00',
        rejectionReason: 'Valor muito alto para o equipamento.',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-05T16:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-06T09:00:00', 2, 'Mário Santos', 'Orçamento de R$ 450,00', RequestStatus.OPEN),
          this.h(RequestStatus.REJECTED, '2024-03-06T11:00:00', undefined, undefined, 'Rejeitado: Valor muito alto', RequestStatus.QUOTED),
        ],
      },
      {
        id: 6, clientId: 5, clientName: 'Joana Cliente',
        openedAt: '2024-03-06T08:00:00',
        equipmentDescription: 'Notebook Lenovo - Bateria não carrega',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Bateria não segura carga há 2 semanas.',
        status: RequestStatus.PAID,
        quoteValue: 320.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-07T09:00:00',
        maintenanceDescription: 'Substituição da bateria por modelo compatível.',
        clientOrientations: 'Realizar calibração completa da bateria.',
        maintainedByEmployeeId: 1, maintainedByEmployeeName: 'Maria Silva',
        maintainedAt: '2024-03-09T15:00:00',
        paidAt: '2024-03-10T10:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-06T08:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-07T09:00:00', 1, 'Maria Silva', 'Orçamento de R$ 320,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-07T14:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,    '2024-03-09T15:00:00', 1, 'Maria Silva', 'Manutenção concluída', RequestStatus.APPROVED),
          this.h(RequestStatus.PAID,     '2024-03-10T10:00:00', undefined, undefined, 'Pagamento efetuado pelo cliente', RequestStatus.FIXED),
        ],
      },
      {
        id: 7, clientId: 5, clientName: 'Joana Cliente',
        openedAt: '2024-03-08T10:00:00',
        equipmentDescription: 'Mouse Logitech - Clique duplo',
        categoryId: 5, categoryName: 'Mouse',
        defectDescription: 'Botão esquerdo ativa clique duplo com um clique.',
        status: RequestStatus.FINALIZED,
        quoteValue: 120.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-09T08:00:00',
        maintenanceDescription: 'Substituição do microswitch do botão esquerdo.',
        clientOrientations: 'Usar normalmente, garantia de 90 dias.',
        maintainedByEmployeeId: 2, maintainedByEmployeeName: 'Mário Santos',
        maintainedAt: '2024-03-11T11:00:00',
        paidAt: '2024-03-11T14:00:00',
        finalizedByEmployeeId: 2, finalizedByEmployeeName: 'Mário Santos',
        finalizedAt: '2024-03-12T09:00:00',
        history: [
          this.h(RequestStatus.OPEN,      '2024-03-08T10:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,    '2024-03-09T08:00:00', 2, 'Mário Santos', 'Orçamento de R$ 120,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED,  '2024-03-09T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,     '2024-03-11T11:00:00', 2, 'Mário Santos', 'Manutenção concluída', RequestStatus.APPROVED),
          this.h(RequestStatus.PAID,      '2024-03-11T14:00:00', undefined, undefined, 'Pagamento efetuado', RequestStatus.FIXED),
          this.h(RequestStatus.FINALIZED, '2024-03-12T09:00:00', 2, 'Mário Santos', 'Solicitação finalizada', RequestStatus.PAID),
        ],
      },
      {
        id: 8, clientId: 6, clientName: 'Joaquina Cliente',
        openedAt: '2024-03-10T09:00:00',
        equipmentDescription: 'Desktop Dell - Superaquecimento',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'Computador desliga sozinho por superaquecimento.',
        status: RequestStatus.REDIRECTED,
        quoteValue: 260.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-11T08:30:00',
        redirectedToEmployeeId: 2, redirectedToEmployeeName: 'Mário Santos',
        history: [
          this.h(RequestStatus.OPEN,       '2024-03-10T09:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,     '2024-03-11T08:30:00', 1, 'Maria Silva', 'Orçamento de R$ 260,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED,   '2024-03-11T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.REDIRECTED, '2024-03-11T14:00:00', 1, 'Maria Silva', 'Redirecionado para Mário Santos', RequestStatus.APPROVED),
        ],
      },
      {
        id: 9, clientId: 3, clientName: 'João Cliente',
        openedAt: '2024-03-12T14:00:00',
        equipmentDescription: 'Impressora Epson - Não imprime colorido',
        categoryId: 3, categoryName: 'Impressora',
        defectDescription: 'Cores não saem corretamente, apenas preto.',
        status: RequestStatus.OPEN,
        history: [
          this.h(RequestStatus.OPEN, '2024-03-12T14:00:00', undefined, undefined, 'Solicitação aberta'),
        ],
      },
      {
        id: 10, clientId: 6, clientName: 'Joaquina Cliente',
        openedAt: '2024-03-13T08:00:00',
        equipmentDescription: 'Notebook Asus - Teclas sem resposta',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Várias teclas não respondem ao toque.',
        status: RequestStatus.QUOTED,
        quoteValue: 280.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-14T09:00:00',
        history: [
          this.h(RequestStatus.OPEN,   '2024-03-13T08:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED, '2024-03-14T09:00:00', 2, 'Mário Santos', 'Orçamento de R$ 280,00', RequestStatus.OPEN),
        ],
      },
      {
        id: 11, clientId: 4, clientName: 'José Cliente',
        openedAt: '2024-03-14T10:00:00',
        equipmentDescription: 'Desktop HP - HD com barulho',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'HD fazendo barulho estranho e lentidão no sistema.',
        status: RequestStatus.APPROVED,
        quoteValue: 400.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-15T09:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-14T10:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-15T09:00:00', 1, 'Maria Silva', 'Orçamento de R$ 400,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-15T11:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
        ],
      },
      {
        id: 12, clientId: 5, clientName: 'Joana Cliente',
        openedAt: '2024-03-15T09:00:00',
        equipmentDescription: 'Mouse sem fio - Sem sinal',
        categoryId: 5, categoryName: 'Mouse',
        defectDescription: 'Mouse sem fio não conecta ao receptor.',
        status: RequestStatus.FIXED,
        quoteValue: 150.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-16T08:00:00',
        maintenanceDescription: 'Receptor substituído e firmware atualizado.',
        clientOrientations: 'Manter receptor longe de fontes de interferência.',
        maintainedByEmployeeId: 2, maintainedByEmployeeName: 'Mário Santos',
        maintainedAt: '2024-03-18T15:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-15T09:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-16T08:00:00', 2, 'Mário Santos', 'Orçamento de R$ 150,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-16T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,    '2024-03-18T15:00:00', 2, 'Mário Santos', 'Manutenção concluída', RequestStatus.APPROVED),
        ],
      },
      {
        id: 13, clientId: 3, clientName: 'João Cliente',
        openedAt: '2024-03-16T11:00:00',
        equipmentDescription: 'Teclado USB - Teclas E e R não funcionam',
        categoryId: 4, categoryName: 'Teclado',
        defectDescription: 'Teclas E e R não respondem após derramar líquido.',
        status: RequestStatus.REJECTED,
        quoteValue: 200.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-17T08:00:00',
        rejectionReason: 'Prefiro comprar um teclado novo.',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-16T11:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-17T08:00:00', 1, 'Maria Silva', 'Orçamento de R$ 200,00', RequestStatus.OPEN),
          this.h(RequestStatus.REJECTED, '2024-03-17T09:00:00', undefined, undefined, 'Rejeitado: Prefiro comprar um teclado novo', RequestStatus.QUOTED),
        ],
      },
      {
        id: 14, clientId: 6, clientName: 'Joaquina Cliente',
        openedAt: '2024-03-17T09:00:00',
        equipmentDescription: 'Notebook Dell - Fonte não carrega',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Fonte original parou de funcionar.',
        status: RequestStatus.PAID,
        quoteValue: 180.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-18T08:00:00',
        maintenanceDescription: 'Fonte substituída por compatível com o modelo.',
        clientOrientations: 'Usar apenas fontes originais ou certificadas.',
        maintainedByEmployeeId: 1, maintainedByEmployeeName: 'Maria Silva',
        maintainedAt: '2024-03-19T14:00:00',
        paidAt: '2024-03-20T09:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-17T09:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-18T08:00:00', 2, 'Mário Santos', 'Orçamento de R$ 180,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-18T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,    '2024-03-19T14:00:00', 1, 'Maria Silva', 'Manutenção concluída', RequestStatus.APPROVED),
          this.h(RequestStatus.PAID,     '2024-03-20T09:00:00', undefined, undefined, 'Pagamento efetuado', RequestStatus.FIXED),
        ],
      },
      {
        id: 15, clientId: 4, clientName: 'José Cliente',
        openedAt: '2024-03-18T14:00:00',
        equipmentDescription: 'Impressora Canon - Cabeça entupida',
        categoryId: 3, categoryName: 'Impressora',
        defectDescription: 'Impressões saem com listras e falhas.',
        status: RequestStatus.FINALIZED,
        quoteValue: 230.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-19T08:00:00',
        maintenanceDescription: 'Limpeza e alinhamento da cabeça de impressão.',
        clientOrientations: 'Imprimir ao menos 1 página por semana.',
        maintainedByEmployeeId: 1, maintainedByEmployeeName: 'Maria Silva',
        maintainedAt: '2024-03-20T11:00:00',
        paidAt: '2024-03-21T09:00:00',
        finalizedByEmployeeId: 1, finalizedByEmployeeName: 'Maria Silva',
        finalizedAt: '2024-03-21T15:00:00',
        history: [
          this.h(RequestStatus.OPEN,      '2024-03-18T14:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,    '2024-03-19T08:00:00', 1, 'Maria Silva', 'Orçamento de R$ 230,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED,  '2024-03-19T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.FIXED,     '2024-03-20T11:00:00', 1, 'Maria Silva', 'Manutenção concluída', RequestStatus.APPROVED),
          this.h(RequestStatus.PAID,      '2024-03-21T09:00:00', undefined, undefined, 'Pagamento efetuado', RequestStatus.FIXED),
          this.h(RequestStatus.FINALIZED, '2024-03-21T15:00:00', 1, 'Maria Silva', 'Solicitação finalizada', RequestStatus.PAID),
        ],
      },
      {
        id: 16, clientId: 5, clientName: 'Joana Cliente',
        openedAt: '2024-03-20T10:00:00',
        equipmentDescription: 'Desktop Positivo - Tela azul da morte',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'Computador reinicia com tela azul (BSOD).',
        status: RequestStatus.OPEN,
        history: [
          this.h(RequestStatus.OPEN, '2024-03-20T10:00:00', undefined, undefined, 'Solicitação aberta'),
        ],
      },
      {
        id: 17, clientId: 6, clientName: 'Joaquina Cliente',
        openedAt: '2024-03-21T08:00:00',
        equipmentDescription: 'Notebook Samsung - Placa de vídeo',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Tela apresenta artefatos gráficos ao iniciar jogos.',
        status: RequestStatus.REDIRECTED,
        quoteValue: 750.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-22T08:00:00',
        redirectedToEmployeeId: 2, redirectedToEmployeeName: 'Mário Santos',
        history: [
          this.h(RequestStatus.OPEN,       '2024-03-21T08:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,     '2024-03-22T08:00:00', 1, 'Maria Silva', 'Orçamento de R$ 750,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED,   '2024-03-22T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
          this.h(RequestStatus.REDIRECTED, '2024-03-22T14:00:00', 1, 'Maria Silva', 'Redirecionado para Mário Santos', RequestStatus.APPROVED),
        ],
      },
      {
        id: 18, clientId: 3, clientName: 'João Cliente',
        openedAt: '2024-03-22T09:00:00',
        equipmentDescription: 'Notebook Acer - Ventilador barulhento',
        categoryId: 1, categoryName: 'Notebook',
        defectDescription: 'Ventilador faz barulho alto e o notebook esquenta.',
        status: RequestStatus.QUOTED,
        quoteValue: 190.00,
        quotedByEmployeeId: 2, quotedByEmployeeName: 'Mário Santos',
        quotedAt: '2024-03-23T08:00:00',
        history: [
          this.h(RequestStatus.OPEN,   '2024-03-22T09:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED, '2024-03-23T08:00:00', 2, 'Mário Santos', 'Orçamento de R$ 190,00', RequestStatus.OPEN),
        ],
      },
      {
        id: 19, clientId: 4, clientName: 'José Cliente',
        openedAt: '2024-03-23T11:00:00',
        equipmentDescription: 'Desktop - Memória RAM insuficiente',
        categoryId: 2, categoryName: 'Desktop',
        defectDescription: 'Computador muito lento, 4GB RAM não são suficientes.',
        status: RequestStatus.OPEN,
        history: [
          this.h(RequestStatus.OPEN, '2024-03-23T11:00:00', undefined, undefined, 'Solicitação aberta'),
        ],
      },
      {
        id: 20, clientId: 5, clientName: 'Joana Cliente',
        openedAt: '2024-03-24T14:00:00',
        equipmentDescription: 'Impressora HP - Cartucho não reconhecido',
        categoryId: 3, categoryName: 'Impressora',
        defectDescription: 'Cartucho recargado não é reconhecido pela impressora.',
        status: RequestStatus.APPROVED,
        quoteValue: 95.00,
        quotedByEmployeeId: 1, quotedByEmployeeName: 'Maria Silva',
        quotedAt: '2024-03-25T08:00:00',
        history: [
          this.h(RequestStatus.OPEN,     '2024-03-24T14:00:00', undefined, undefined, 'Solicitação aberta'),
          this.h(RequestStatus.QUOTED,   '2024-03-25T08:00:00', 1, 'Maria Silva', 'Orçamento de R$ 95,00', RequestStatus.OPEN),
          this.h(RequestStatus.APPROVED, '2024-03-25T10:00:00', undefined, undefined, 'Cliente aprovou', RequestStatus.QUOTED),
        ],
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

  updateRequest(id: number, changes: Partial<Solicitation>): void {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Solicitação não encontrada.');
    requests[index] = { ...requests[index], ...changes };  
    localStorage.setItem(this.KEY, JSON.stringify(requests));
  }

  updateRequestStatus(id: number, status: RequestStatus): void {
    this.updateRequest(id, { status });
  }

  getById(id: number): Solicitation | undefined {
    return this.getRequests().find(r => r.id === id);
  }
}
