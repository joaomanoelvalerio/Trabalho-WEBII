import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';
import { SnackConfig } from '../../../shared/services/snack-config';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './manage-categories.html',
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly snackConfig = inject(SnackConfig);
  private readonly destroy$ = new Subject<void>();

  categories: Category[] = [];

  /** Nome digitado no campo de nova categoria. */
  newCategoryName = '';

  /** ID da categoria em edição inline, ou null se nenhuma. */
  editingId: number | null = null;

  /** Valor temporário do nome durante a edição inline. */
  editingName = '';

  /** ID da categoria aguardando confirmação de exclusão, ou null se nenhuma. */
  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Recarrega a lista de categorias a partir do serviço. */
  load(): void {
    this.categoryService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (categories) => this.categories = categories,
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar categorias', 'Fechar', this.snackConfig.long),
    });
  }

  /** Cadastra uma nova categoria com o nome digitado e recarrega a lista. */
  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.categoryService.registerCategory(name).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.load();
        this.snackBar.open('Categoria adicionada com sucesso!', 'Fechar', this.snackConfig.default);
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao adicionar categoria', 'Fechar', this.snackConfig.long),
    });
  }

  /**
   * Ativa o modo de edição inline para a categoria informada.
   * Fecha qualquer confirmação de exclusão pendente.
   */
  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.editingName = cat.name;
    this.confirmDeleteId = null;
  }

  /** Cancela a edição inline sem persistir alterações. */
  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
  }

  /** Persiste o novo nome da categoria e encerra o modo de edição. */
  saveEdit(cat: Category): void {
    const name = this.editingName.trim();
    if (!name) return;
    this.categoryService.atualizarCategoria({ ...cat, name }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
        this.snackBar.open('Categoria atualizada!', 'Fechar', this.snackConfig.default);
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao atualizar categoria', 'Fechar', this.snackConfig.long),
    });
  }

  /**
   * Ativa o modo de confirmação de exclusão para a categoria informada.
   * Fecha qualquer edição inline pendente.
   */
  askDelete(id: number): void {
    this.confirmDeleteId = id;
    this.editingId = null;
  }

  /** Cancela a confirmação de exclusão sem remover a categoria. */
  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  /** Confirma e executa a remoção da categoria após aprovação do usuário. */
  confirmDelete(id: number): void {
    this.categoryService.removerCategoria(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.confirmDeleteId = null;
        this.load();
        this.snackBar.open('Categoria removida.', 'Fechar', this.snackConfig.default);
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao remover categoria', 'Fechar', this.snackConfig.long),
    });
  }
}
