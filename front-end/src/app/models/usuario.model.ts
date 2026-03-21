import { Endereco } from './endereco.model';

export interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'cliente' | 'funcionario' | 'admin';
  endereco: Endereco;
  senha: string;
}
