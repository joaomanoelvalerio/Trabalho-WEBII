import { Address } from './address.model';

export interface User {
  id: number;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';
  address: Address;
  password: string;
  birthDate?: string;
}