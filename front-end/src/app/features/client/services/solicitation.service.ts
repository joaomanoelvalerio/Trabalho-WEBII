import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitation } from '../../../shared/models/solicitation.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitationService {
  private readonly apiUrl = 'http://localhost:8080/api/solicitations';

  constructor(private http: HttpClient) {}

  getByClient(clientId: number): Observable<Solicitation[]> {
    return this.http.get<Solicitation[]>(`${this.apiUrl}/client/${clientId}`);
  }
}