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
      // teu seed aqui
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
    return this.getAllUsers().filter(u => u.role === 'EMPLOYEE');
  }

  register(data: Omit<User, 'id' | 'role' | 'password'>) {
    const users = this.getAllUsers();

    if (users.some(u => u.cpf === data.cpf)) {
      return throwError(() => new Error('CPF já cadastrado.'));
    }

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return throwError(() => new Error('E-mail já cadastrado.'));
    }

    const tempPassword = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser: User = {
      id: users.length > 0
        ? Math.max(...users.map(u => u.id)) + 1
        : 1,

      role: 'CLIENT',
      ...data,
      password: tempPassword,
    };

    users.push(newUser);

    this.saveUsers(users);

    return of({
      success: true,
      temporaryPassword: tempPassword
    });
  }

  addEmployee(data: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  }): User {

    const users = this.getAllUsers();

    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.password?.trim() ||
      !data.birthDate?.trim()
    ) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    if (
      users.some(
        u => u.email.toLowerCase() === data.email.toLowerCase()
      )
    ) {
      throw new Error('E-mail já cadastrado.');
    }

    const newUser: User = {
      id: users.length > 0
        ? Math.max(...users.map(u => u.id)) + 1
        : 1,

      role: 'EMPLOYEE',

      cpf: '',
      phone: '',

      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
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
    data: {
      name: string;
      email: string;
      password?: string;
      birthDate: string;
    }
  ): User {

    const users = this.getAllUsers();

    const index = users.findIndex(
      u => u.id === id && u.role === 'EMPLOYEE'
    );

    if (index === -1) {
      throw new Error('Funcionário não encontrado.');
    }

    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.birthDate?.trim()
    ) {
      throw new Error(
        'Nome, e-mail e data de nascimento são obrigatórios.'
      );
    }

    if (
      users.some(
        u =>
          u.id !== id &&
          u.email.toLowerCase() === data.email.toLowerCase()
      )
    ) {
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
      throw new Error(
        'Você não pode remover seu próprio usuário.'
      );
    }

    if (employees.length <= 1) {
      throw new Error(
        'Não é possível remover o único funcionário.'
      );
    }

    const users = this
      .getAllUsers()
      .filter(u => u.id !== id);

    this.saveUsers(users);
  }
}