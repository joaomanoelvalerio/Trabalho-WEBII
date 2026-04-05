import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'app_users';

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    if (localStorage.getItem(this.USERS_KEY)) return;

    const seed: User[] = [
      {
        id: 1, name: 'Maria Silva', email: 'maria@manutencao.com',
        password: '1234', role: 'EMPLOYEE', cpf: '', phone: '',
        birthDate: '1990-05-10',
        address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      },
      {
        id: 2, name: 'Mário Santos', email: 'mario@manutencao.com',
        password: '1234', role: 'EMPLOYEE', cpf: '', phone: '',
        birthDate: '1988-03-22',
        address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      },
      {
        id: 3, name: 'João Cliente', email: 'joao@email.com',
        password: '1234', role: 'CLIENT', cpf: '111.111.111-11',
        phone: '(41) 99999-0001',
        address: { zipCode: '80010-000', street: 'Rua XV de Novembro', number: '100', complement: '', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' },
      },
      {
        id: 4, name: 'José Cliente', email: 'jose@email.com',
        password: '1234', role: 'CLIENT', cpf: '222.222.222-22',
        phone: '(41) 99999-0002',
        address: { zipCode: '80020-000', street: 'Av. Sete de Setembro', number: '200', complement: '', neighborhood: 'Batel', city: 'Curitiba', state: 'PR' },
      },

      {
        id: 5, name: 'Joana Cliente', email: 'joana@email.com',
        password: '1234', role: 'CLIENT', cpf: '333.333.333-33',
        phone: '(41) 99999-0003',
        address: { zipCode: '80030-000', street: 'Rua Marechal Deodoro', number: '300', complement: '', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' },
      },
      {
        id: 6, name: 'Joaquina Cliente', email: 'joaquina@email.com',
        password: '1234', role: 'CLIENT', cpf: '444.444.444-44',
        phone: '(41) 99999-0004',
        address: { zipCode: '80040-000', street: 'Rua das Flores', number: '400', complement: 'Apto 12', neighborhood: 'Mercês', city: 'Curitiba', state: 'PR' },
      },
    ];

    localStorage.setItem(this.USERS_KEY, JSON.stringify(seed));
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  register(data: Omit<User, 'id' | 'role' | 'password'>) {
    const users = this.getUsers();

    if (users.some(u => u.cpf === data.cpf)) {
      return throwError(() => new Error('CPF já cadastrado.'));
    }
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return throwError(() => new Error('E-mail já cadastrado.'));
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'CLIENT',
      password: Math.floor(1000 + Math.random() * 9000).toString(),
      ...data,
    };

    users.push(newUser);
    this.saveUsers(users);
    return of({ success: true, temporaryPassword: newUser.password });
  }

  login(email: string, password: string) {
    const user = this.getUsers().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return throwError(() => new Error('E-mail ou senha inválidos.'));
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return of({ success: true, user });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser(): User | null {
    const raw = localStorage.getItem('loggedInUser');
    return raw ? JSON.parse(raw) : null;
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  getEmployees(): User[] {
    return this.getUsers().filter(u => u.role === 'EMPLOYEE');
  }

  addEmployee(data: { name: string; email: string; password: string; birthDate: string }): User {
    const users = this.getUsers();

    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim() || !data.birthDate?.trim()) {
      throw new Error('Todos os campos são obrigatórios.');
    }
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('E-mail já cadastrado.');
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'EMPLOYEE',
      cpf: '', phone: '',
      address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      birthDate: data.birthDate.trim(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateEmployee(id: number, data: { name: string; email: string; password?: string; birthDate: string }): User {
    const users = this.getUsers();
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

  removeEmployee(id: number): void {
    const loggedUser = this.getLoggedInUser();
    if (!loggedUser) throw new Error('Usuário não autenticado.');
    if (loggedUser.id === id) throw new Error('Você não pode remover seu próprio usuário.');

    const employees = this.getEmployees();
    if (employees.length <= 1) throw new Error('Não é possível remover o único funcionário.');

    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  }
}