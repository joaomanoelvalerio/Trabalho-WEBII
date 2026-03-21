import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);

  constructor() { }

  buscarCep(cep: string): Observable<Endereco> {
    const cepFormatado = cep.replace(/\D/g, '');
    if (cepFormatado.length !== 8) {
      return new Observable(observer => observer.error('CEP inválido. Deve conter 8 dígitos.'));
    }
    return this.http.get<Endereco>(`https://viacep.com.br/ws/${cepFormatado}/json/`);
  }
}
