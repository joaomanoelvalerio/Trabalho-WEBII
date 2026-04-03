import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'app_users';

  constructor() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return JSON.parse(usersJson || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

register(data: Omit<User, 'id' | 'role' | 'password'>) {
    const users = this.getUsers();

    if (users.some(u => u.cpf === data.cpf)) {
      return throwError(() => new Error('CPF já cadastrado.'));
    }
    if (users.some(u => u.email === data.email)) {
      return throwError(() => new Error('Email já cadastrado.'));
    }

    const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'CLIENT',
      password: randomPassword,
      ...data
    };

    users.push(newUser);
    this.saveUsers(users);

    return of({ success: true, message: 'Usuário registrado!', temporaryPassword: newUser.password });
  }

  login(email: string, password: string) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return of({ success: true, user });
    } else {
      return throwError(() => new Error('Email ou senha inválidos.'));
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser(): User | null {
    const userJson = localStorage.getItem('loggedInUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  getEmployees(): User[] {
    return this.getUsers().filter((u) => u.role === 'EMPLOYEE');
  }

  addEmployee(data: { name: string; email: string; password: string; birthDate: string }): User {
    const loggedUser = this.getLoggedInUser();
    if (!loggedUser || loggedUser.role !== 'EMPLOYEE') {
      throw new Error('Only employees can create other employees.');
    }

    const users = this.getUsers();

    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim() || !data.birthDate?.trim()) {
      throw new Error('All fields are required.');
    }

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('Email already registered.');
    }

    const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextId,
      role: 'EMPLOYEE',
      password: data.password,
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
      birthDate: data.birthDate,
      name: data.name.trim(),
      email: data.email.trim(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateEmployee(id: number, data: { name: string; email: string; password?: string; birthDate: string }): User {
    const loggedUser = this.getLoggedInUser();
    if (!loggedUser || loggedUser.role !== 'EMPLOYEE') {
      throw new Error('Only employees can update employee data.');
    }

    const users = this.getUsers();
    const targetIndex = users.findIndex((u) => u.id === id && u.role === 'EMPLOYEE');

    if (targetIndex === -1) {
      throw new Error('Employee not found.');
    }

    const existing = users[targetIndex];

    if (!data.name?.trim() || !data.email?.trim() || !data.birthDate?.trim()) {
      throw new Error('Name, email, and birth date are required.');
    }

    if (users.some((u) => u.id !== id && u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('Email already registered by another user.');
    }

    users[targetIndex] = {
      ...existing,
      name: data.name.trim(),
      email: data.email.trim(),
      birthDate: data.birthDate.trim(),
      password: data.password?.trim() ? data.password.trim() : existing.password,
    };

    this.saveUsers(users);
    return users[targetIndex];
  }

  removeEmployee(id: number): void {
    const loggedUser = this.getLoggedInUser();
    if (!loggedUser || loggedUser.role !== 'EMPLOYEE') {
      throw new Error('Only employees can remove other employees.');
    }

    if (loggedUser.id === id) {
      throw new Error('You cannot remove your own user.');
    }

    const employees = this.getEmployees();
    if (employees.length <= 1) {
      throw new Error('You cannot remove the last employee.');
    }

    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) {
      throw new Error('Employee not found.');
    }

    this.saveUsers(filtered);
  }
}

