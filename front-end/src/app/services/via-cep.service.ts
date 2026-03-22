import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);

  buscarCep(cep: string): Observable<Endereco> {
    const cepFormatado = cep.replace(/\D/g, '');
    
    return this.http.get<any>(`https://viacep.com.br/ws/${cepFormatado}/json/`).pipe(
      map(dados => {
        if (dados.erro) {
          throw new Error('CEP não encontrado');
        }
        return {
          cep: dados.cep,
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,    
          complemento: dados.complemento
        } as Endereco;
      })
    );
  }
}