import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { Category } from '../../../shared/models/category.model';
import { RequestStatus } from '../../../shared/models/solicitation.model';
import { CategoryService } from '../../../shared/services/category.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest implements OnInit {
  private readonly router          = inject(Router);
  private readonly storageService  = inject(StorageService);
  private readonly authService     = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar        = inject(MatSnackBar);

  categories: Category[] = [];

  newRequest = {
    equipmentDescription: '',
    category: null as Category | null,
    defectDescription: '',
  };

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: () => {
        this.snackBar.open('Erro ao carregar categorias.', 'Fechar', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  countWords(text: string): number {
    if (!text?.trim()) return 0;
    return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  }

  onSubmit(): void {
    const user = this.authService.getLoggedInUser();
    if (!user) return;

    const dataAtual = new Date().toISOString();

    this.storageService.saveRequest({
      clientId: user.id,
      clientName: user.name,
      openedAt: dataAtual,
      equipmentDescription: this.newRequest.equipmentDescription.trim(),
      categoryId: this.newRequest.category?.id,
      categoryName: this.newRequest.category?.name,
      defectDescription: this.newRequest.defectDescription.trim(),
      status: RequestStatus.OPEN,
      history: [
        {
          date: dataAtual,
          fromStatus: null,
          toStatus: RequestStatus.OPEN,
          note: 'Solicitação aberta pelo cliente.',
        },
      ],
    }).subscribe({
      next: () => {
        this.snackBar.open('Solicitação enviada com sucesso!', 'Fechar', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.router.navigate(['/client']);
      },
      error: (e: Error) => {
        this.snackBar.open(e.message, 'Fechar', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/client']);
  }
}
