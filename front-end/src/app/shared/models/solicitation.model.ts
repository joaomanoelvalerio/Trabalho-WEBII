export enum RequestState {
  ABERTA = 'ABERTA',
  ORCADA = 'ORCADA',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
  EM_EXECUCAO = 'EM_EXECUCAO',
  ARRUMADA = 'ARRUMADA',
  PAGA = 'PAGA',
  FINALIZADA = 'FINALIZADA',
}

export interface Solicitation {
  id: number;
  dataSolicitacao: string;
  descricao: string;
  estado: RequestState;
  clienteId: number;
}