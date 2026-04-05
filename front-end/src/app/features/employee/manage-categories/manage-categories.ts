import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './manage-categories.html',
})
export class ManageCategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);

  categories: Category[] = [];
  newCategoryName = '';
  editingId: number | null = null;
  editingName = '';
  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categories = this.categoryService.getAll();
  }

  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    try {
      this.categoryService.registerCategory(name);
      this.newCategoryName = '';
      this.load();
      this.snackBar.open('Categoria adicionada com sucesso!', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
    }
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
    try {
      this.categoryService.atualizarCategoria({ id: cat.id, name });
      this.cancelEdit();
      this.load();
      this.snackBar.open('Categoria atualizada!', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
    }
  }

  askDelete(id: number): void {
    this.confirmDeleteId = id;
    this.editingId = null;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(id: number): void {
    try {
      this.categoryService.removerCategoria(id);
      this.confirmDeleteId = null;
      this.load();
      this.snackBar.open('Categoria removida.', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
    }
  }
}