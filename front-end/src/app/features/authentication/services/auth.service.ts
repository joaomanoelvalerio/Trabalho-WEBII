import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private userService: UserService
  ) {}

  login(email: string, password: string) {

    const user = this.userService.findByEmail(email);

    if (!user || user.password !== password) {
      return throwError(() =>
        new Error('E-mail ou senha inválidos.')
      );
    }

    localStorage.setItem(
      'loggedInUser',
      JSON.stringify(user)
    );

    return of({
      success: true,
      user
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser(): User | null {
    const raw = localStorage.getItem('loggedInUser');

    return raw
      ? JSON.parse(raw)
      : null;
  }
}