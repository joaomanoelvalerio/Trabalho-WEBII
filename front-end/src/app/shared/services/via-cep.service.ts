import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);

  buscarCep(cep: string): Observable<Address> {
    const cepFormatado = cep.replace(/\D/g, '');

    if (cepFormatado.length !== 8) {
      return new Observable(observer => observer.error('CEP inválido.'));
    }

    return this.http.get<any>(`https://viacep.com.br/ws/${cepFormatado}/json/`).pipe(
      map(dados => {
        if (dados.erro) {
          throw new Error('CEP não encontrado');
        }
        return {
          zipCode: dados.cep,
          street: dados.logradouro,
          neighborhood: dados.bairro,
          city: dados.localidade,
          state: dados.uf,
          complement: dados.complemento,
          number: '',
        } as Address;
      })
    );
  }
}