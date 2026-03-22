import { Address } from './address.model';

export interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'cliente' | 'funcionario' | 'admin';
  endereco: Address;
  senha: string;
}
