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

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      role: 'CLIENT',
      password: '123456',
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
}