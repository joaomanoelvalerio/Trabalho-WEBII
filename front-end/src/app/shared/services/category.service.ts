import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { AuthService } from '../../features/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly KEY = 'app_categories';

  constructor(private authService: AuthService) {
    this.initDefaultCategories();
  }

  private initDefaultCategories(): void {
    const stored = localStorage.getItem(this.KEY);
    if (!stored) {
      const defaults: Category[] = [
        { id: 1, name: 'Notebook' },
        { id: 2, name: 'Desktop' },
        { id: 3, name: 'Impressora' },
        { id: 4, name: 'Teclado' },
        { id: 5, name: 'Mouse' },
      ];
      localStorage.setItem(this.KEY, JSON.stringify(defaults));
    }
  }

  getCategorias(): Category[] {
    const stored = localStorage.getItem(this.KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getCategoriaById(id: number): Category | undefined {
    return this.getCategorias().find((c) => c.id === id);
  }

  cadastrarCategoria(name: string): Category {
    this.validateEmployeeRole();
    const categories = this.getCategorias();
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw new Error('Category name cannot be empty.');
    }
    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error('Category already registered.');
    }

    const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    const newCategory: Category = { id: nextId, name: trimmedName };
    categories.push(newCategory);
    this.save(categories);
    return newCategory;
  }

  atualizarCategoria(updated: Category): Category {
    this.validateEmployeeRole();
    if (!updated || !updated.name?.trim()) {
      throw new Error('Category name cannot be empty.');
    }

    const categories = this.getCategorias();
    const idx = categories.findIndex((c) => c.id === updated.id);
    if (idx === -1) {
      throw new Error('Category not found.');
    }

    if (
      categories.some(
        (c) => c.id !== updated.id && c.name.toLowerCase() === updated.name.trim().toLowerCase(),
      )
    ) {
      throw new Error('Another category with this name already exists.');
    }

    categories[idx] = { ...categories[idx], name: updated.name.trim() };
    this.save(categories);
    return categories[idx];
  }

  removerCategoria(id: number): void {
    this.validateEmployeeRole();
    const categories = this.getCategorias();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error('Category does not exist.');
    }

    categories.splice(idx, 1);
    this.save(categories);
  }

  private save(categories: Category[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(categories));
  }

  private validateEmployeeRole(): void {
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'EMPLOYEE') {
      throw new Error('Only employees can modify categories.');
    }
  }
}
