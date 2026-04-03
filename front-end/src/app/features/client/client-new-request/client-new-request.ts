import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';
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
export class ClientNewRequest implements OnInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];

  newRequest = {
    descricaoEquipamento: '',
    categoria: null as number | null,
    descricaoDefeito: '',
  };

  ngOnInit(): void {
    this.categories = this.categoryService.getCategorias();
  }

  sendRequest(): void {
    console.log(this.newRequest);
    this.storageService.salvarSolicitacao(this.newRequest);

    alert('Solicitação enviada com sucesso!');

    this.router.navigate(['/client']);
  }

  return(): void {
    this.router.navigate(['/client']);
  }
}
