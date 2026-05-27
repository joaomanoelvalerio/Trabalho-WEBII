import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';

interface LoginResponse {
  success: boolean;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/users';
  private readonly LOGGED_USER_KEY = 'loggedInUser';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        sessionStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(response.user));
      }),
      catchError(this.mapHttpError),
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.LOGGED_USER_KEY);
  }

  getLoggedInUser(): User | null {
    const raw = sessionStorage.getItem(this.LOGGED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private mapHttpError(error: HttpErrorResponse) {
    const message = error.error?.message || error.error?.error || error.message || 'Erro de autenticação.';
    return throwError(() => new Error(message));
  }
}
