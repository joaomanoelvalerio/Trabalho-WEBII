import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RequestStatus } from '../../../shared/models/solicitation.model'; 

@Component({
  selector: 'app-client-new-request',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest implements OnInit {
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