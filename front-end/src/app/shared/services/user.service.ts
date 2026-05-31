import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface RegisterResponse {
  success: boolean;
  temporaryPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.mapHttpError),
    );
  }

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/employees`).pipe(
      catchError(this.mapHttpError),
    );
  }

  register(data: Omit<User, 'id' | 'role' | 'password' | 'active'>): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register-client`, data).pipe(
      catchError(this.mapHttpError),
    );
  }

  addEmployee(data: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/employees`, data).pipe(
      catchError(this.mapHttpError),
    );
  }

  updateEmployee(
    id: number,
    data: { name: string; email: string; password?: string; birthDate: string; }
  ): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/employees/${id}`, data).pipe(
      catchError(this.mapHttpError),
    );
  }

  removeEmployee(id: number, loggedUserId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${id}`, {
      params: { loggedUserId },
    }).pipe(
      catchError(this.mapHttpError),
    );
  }

  private mapHttpError(error: HttpErrorResponse) {
    const message = error.error?.message || error.error?.error || error.error || error.message || 'Erro na requisição.';
    return throwError(() => new Error(message));
  }
}
