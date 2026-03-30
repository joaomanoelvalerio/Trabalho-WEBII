import { Component, inject } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-client-new-request',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest {
  private router = inject(Router);
  private storageService = inject(StorageService);
  categories: { id: number; nome: string }[] = [
    { id: 1, nome: 'Notebook' },
    { id: 2, nome: 'Desktop' },
    { id: 3, nome: 'Impressora' },
    { id: 4, nome: 'Teclado' },
    { id: 5, nome: 'Mouse' },
  ];

  newRequest = {
    descricaoEquipamento: '',
    categoria: null,
    descricaoDefeito: '',
  };

  enviarSolicitacao(): void {
    console.log(this.newRequest);
    this.storageService.salvarSolicitacao(this.newRequest);

    alert('Solicitação enviada com sucesso!');

    this.router.navigate(['/client']);
  }

  voltar(): void {
    this.router.navigate(['/client']);
  }
}
