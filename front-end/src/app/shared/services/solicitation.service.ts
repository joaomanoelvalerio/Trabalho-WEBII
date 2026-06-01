import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Solicitation, RequestStatus } from '../models/solicitation.model';

@Injectable({ providedIn: 'root' })
export class SolicitationService {
  private readonly apiUrl = 'http://localhost:8080/api/solicitations';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<Solicitation[]> {
    return this.http.get<Solicitation[]>(this.apiUrl).pipe(
      catchError(this.mapHttpError),
    );
  }

  getRequestsByClientId(clientId: number): Observable<Solicitation[]> {
    return this.http.get<Solicitation[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      catchError(this.mapHttpError),
    );
  }

  getOpenRequests(): Observable<Solicitation[]> {
    return this.getRequests().pipe(
      map((requests) => requests.filter((r) => r.status === RequestStatus.OPEN)),
    );
  }

  saveRequest(data: Omit<Solicitation, 'id'>): Observable<Solicitation> {
    return this.http.post<Solicitation>(this.apiUrl, data).pipe(
      catchError(this.mapHttpError),
    );
  }

  updateRequest(id: number, changes: Partial<Solicitation>): Observable<Solicitation> {
    return this.getById(id).pipe(
      switchMap((current) => {
        const updated: Solicitation = { ...current, ...changes, id };
        return this.http.put<Solicitation>(`${this.apiUrl}/${id}`, updated);
      }),
      catchError(this.mapHttpError),
    );
  }

  updateRequestStatus(id: number, status: RequestStatus): Observable<Solicitation> {
    return this.updateRequest(id, { status });
  }

  getById(id: number): Observable<Solicitation> {
    return this.http.get<Solicitation>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.mapHttpError),
    );
  }

  private mapHttpError(error: HttpErrorResponse) {
    const message = error.error?.message || error.error?.error || error.message || 'Erro na operação de solicitação.';
    return throwError(() => new Error(message));
  }
}
