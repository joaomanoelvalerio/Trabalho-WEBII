import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(this.mapHttpError),
    );
  }

  getCategoriaById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.mapHttpError),
    );
  }

  registerCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name: name.trim() }).pipe(
      catchError(this.mapHttpError),
    );
  }

  atualizarCategoria(updated: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${updated.id}`, {
      ...updated,
      name: updated.name.trim(),
    }).pipe(
      catchError(this.mapHttpError),
    );
  }

  removerCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.mapHttpError),
    );
  }

  private mapHttpError(error: HttpErrorResponse) {
    const message = error.error?.message || error.error?.error || error.message || 'Erro na operação de categoria.';
    return throwError(() => new Error(message));
  }
}
