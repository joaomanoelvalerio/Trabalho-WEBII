import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  categories: Category[] = [];

  newCategoryName = '';
  editingId: number | null = null;
  editingName = '';
  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = [...categories].sort((a, b) => a.id - b.id);
          this.cdr.detectChanges();
        },
        error: (e: any) => {
          this.snackBar.open(
            e?.message || 'Erro ao carregar categorias',
            'Fechar',
            this.snackConfig.long
          );
        },
      });
  }

  addCategory(): void {
    const name = this.newCategoryName.trim();

    if (!name) return;

    this.categoryService
      .registerCategory(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newCategoryName = '';
          this.load();

          this.snackBar.open(
            'Categoria adicionada com sucesso!',
            'Fechar',
            this.snackConfig.default
          );
        },
        error: (e: any) => {
          this.snackBar.open(
            e?.message || 'Erro ao adicionar categoria',
            'Fechar',
            this.snackConfig.long
          );
        },
      });
  }

  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.editingName = cat.name;
    this.confirmDeleteId = null;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
  }

  saveEdit(cat: Category): void {
    const name = this.editingName.trim();

    if (!name) return;

    this.categoryService
      .atualizarCategoria({ ...cat, name })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cancelEdit();
          this.load();

          this.snackBar.open(
            'Categoria atualizada!',
            'Fechar',
            this.snackConfig.default
          );
        },
        error: (e: any) => {
          this.snackBar.open(
            e?.message || 'Erro ao atualizar categoria',
            'Fechar',
            this.snackConfig.long
          );
        },
      });
  }

  askDelete(id: number): void {
    this.confirmDeleteId = id;
    this.editingId = null;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(id: number): void {
    this.categoryService
      .removerCategoria(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.confirmDeleteId = null;
          this.load();

          this.snackBar.open(
            'Categoria removida.',
            'Fechar',
            this.snackConfig.default
          );
        },
        error: (e: any) => {
          this.snackBar.open(
            e?.message || 'Erro ao remover categoria',
            'Fechar',
            this.snackConfig.long
          );
        },
      });
  }
}