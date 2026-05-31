import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { Category } from '../../../shared/models/category.model';
import { RequestStatus } from '../../../shared/models/solicitation.model';
import { CategoryService } from '../../../shared/services/category.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackConfig } from '../../../shared/services/snack-config';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-client-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest implements OnInit, OnDestroy {
  private readonly router          = inject(Router);
  private readonly storageService  = inject(StorageService);
  private readonly authService     = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar        = inject(MatSnackBar);
  private readonly snackConfig     = inject(SnackConfig);
  private readonly destroy$        = new Subject<void>();
  private readonly cdr             = inject(ChangeDetectorRef);

  categories: Category[] = [];

  newRequest = {
    equipmentDescription: '',
    category: null as Category | null,
    defectDescription: '',
  };

  ngOnInit(): void {
    this.categoryService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
          next: (categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar categorias.', 'Fechar', this.snackConfig.long);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Solicitação enviada com sucesso!', 'Fechar', this.snackConfig.default);
        this.router.navigate(['/client']);
      },
      error: (e: any) => {
        this.snackBar.open(e?.message || 'Erro ao enviar solicitação', 'Fechar', this.snackConfig.default);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/client']);
  }
}
