import { Injectable } from '@angular/core';
 import { HttpClient }  from'@angular/common/http';
 import { Observable } from   'rxjs';
 import { Solicitacao } from '../models/solicitacao.model';
@Injectable({
   providedIn:'root'
  })
  export class SolicitacaoService {
     private apiUrl = 'http://localhost:8080/api solicitacoes';

     constructor(private http: HttpClient) { }

     getSolicitacoesPorCliente(clienteId: number): Observable<Solicitacao[]> {
      const url = `${this.apiUrl}/cliente/${clienteId}`;
      return this.http.get<Solicitacao[]>(url);
  }
}
