import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USERS_KEY = 'app_users';

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    if (localStorage.getItem(this.USERS_KEY)) return;

    const seed: User[] = [
      {
        id: 1, role: 'EMPLOYEE', active: true,
        name: 'Maria Silva', email: 'maria@empresa.com', password: '1234',
        cpf: '11111111111', phone: '41999990001', birthDate: '1990-05-10',
        address: { zipCode: '80000-000', street: 'Rua das Flores', number: '100', complement: '', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' }
      },
      {
        id: 2, role: 'EMPLOYEE', active: true,
        name: 'Mário Santos', email: 'mario@empresa.com', password: '1234',
        cpf: '22222222222', phone: '41999990002', birthDate: '1988-03-22',
        address: { zipCode: '80000-001', street: 'Av. Paraná', number: '200', complement: '', neighborhood: 'Batel', city: 'Curitiba', state: 'PR' }
      },
      {
        id: 3, role: 'CLIENT', active: true,
        name: 'João Oliveira', email: 'joao@email.com', password: '1234',
        cpf: '33333333333', phone: '41988880001', birthDate: '1995-07-15',
        address: { zipCode: '80010-000', street: 'Rua XV de Novembro', number: '300', complement: 'Apto 5', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' }
      },
      {
        id: 4, role: 'CLIENT', active: true,
        name: 'José Pereira', email: 'jose@email.com', password: '1234',
        cpf: '44444444444', phone: '41988880002', birthDate: '1992-11-30',
        address: { zipCode: '80020-000', street: 'Rua Marechal Deodoro', number: '400', complement: '', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' }
      },
      {
        id: 5, role: 'CLIENT', active: true,
        name: 'Joana Costa', email: 'joana@email.com', password: '1234',
        cpf: '55555555555', phone: '41988880003', birthDate: '1998-01-08',
        address: { zipCode: '80030-000', street: 'Rua Emiliano Perneta', number: '500', complement: 'Casa', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' }
      },
      {
        id: 6, role: 'CLIENT', active: true,
        name: 'Joaquina Ferreira', email: 'joaquina@email.com', password: '1234',
        cpf: '66666666666', phone: '41988880004', birthDate: '2000-09-25',
        address: { zipCode: '80040-000', street: 'Rua Ébano Pereira', number: '600', complement: '', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' }
      },
    ];

    localStorage.setItem(this.USERS_KEY, JSON.stringify(seed));
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  findByEmail(email: string): User | undefined {
    return this.getAllUsers().find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  getEmployees(): User[] {
    return this.getAllUsers().filter(
      u => u.role === 'EMPLOYEE' && u.active !== false
    );
  }

  register(data: Omit<User, 'id' | 'role' | 'password' | 'active'>) {
    const users = this.getAllUsers();

    if (users.some(u => u.cpf === data.cpf)) {
      return throwError(() => new Error('CPF já cadastrado.'));
    }

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return throwError(() => new Error('E-mail já cadastrado.'));
    }

    const tempPassword = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'CLIENT',
      active: true,
      ...data,
      password: tempPassword,
    };

    users.push(newUser);
    this.saveUsers(users);

    return of({ success: true, temporaryPassword: tempPassword });
  }

  addEmployee(data: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  }): User {
    const users = this.getAllUsers();

    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim() || !data.birthDate?.trim()) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('E-mail já cadastrado.');
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'EMPLOYEE',
      active: true,
      cpf: '',
      phone: '',
      address: {
        zipCode: '', street: '', number: '',
        complement: '', neighborhood: '', city: '', state: '',
      },
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      birthDate: data.birthDate.trim(),
    };

    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  updateEmployee(
    id: number,
    data: { name: string; email: string; password?: string; birthDate: string; }
  ): User {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === id && u.role === 'EMPLOYEE');

    if (index === -1) throw new Error('Funcionário não encontrado.');

    if (!data.name?.trim() || !data.email?.trim() || !data.birthDate?.trim()) {
      throw new Error('Nome, e-mail e data de nascimento são obrigatórios.');
    }

    if (users.some(u => u.id !== id && u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('E-mail já cadastrado por outro usuário.');
    }

    users[index] = {
      ...users[index],
      name: data.name.trim(),
      email: data.email.trim(),
      birthDate: data.birthDate.trim(),
      password: data.password?.trim() || users[index].password,
    };

    this.saveUsers(users);
    return users[index];
  }

  removeEmployee(id: number, loggedUserId: number): void {
    const employees = this.getEmployees();

    if (loggedUserId === id) {
      throw new Error('Você não pode remover seu próprio usuário.');
    }

    if (employees.length <= 1) {
      throw new Error('Não é possível remover o único funcionário.');
    }

    const users = this.getAllUsers().map(
      u => u.id === id ? { ...u, active: false } : u
    );

    this.saveUsers(users);
  }
}