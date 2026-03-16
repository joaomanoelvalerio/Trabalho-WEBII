export enum EstadoSolicitacao {
  ABERTA = 'ABERTA',
  ORCADA = 'ORCADA',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
  EM_EXECUCAO = 'EM_EXECUCAO',
  ARRUMADA = 'ARRUMADA',
  PAGA = 'PAGA',
  FINALIZADA = 'FINALIZADA'
}
    export interface Solicitacao {
       id: number;
       dataSolicitacao:string;
      descricao: string;
      estado: EstadoSolicitacao;
     clienteId: number;
 }
