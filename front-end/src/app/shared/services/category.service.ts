import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { AuthService } from '../../features/authentication/services/auth.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly KEY = 'app_categories';

  constructor(private authService: AuthService) {
    this.initDefaultCategories();
  }

  private initDefaultCategories(): void {
    const stored = localStorage.getItem(this.KEY);
    if (!stored) {
      const defaults: Category[] = [
        { id: 1, name: 'Notebook',   active: true },
        { id: 2, name: 'Desktop',    active: true },
        { id: 3, name: 'Impressora', active: true },
        { id: 4, name: 'Teclado',    active: true },
        { id: 5, name: 'Mouse',      active: true },
      ];
      localStorage.setItem(this.KEY, JSON.stringify(defaults));
    }
  }

  getAll(): Category[] {
    const stored = localStorage.getItem(this.KEY);
    const all: Category[] = stored ? JSON.parse(stored) : [];
    return all.filter(c => c.active !== false); // só ativas
  }

  getCategoriaById(id: number): Category | undefined {
    return this.getAll().find(c => c.id === id);
  }

  registerCategory(name: string): Category {
    this.validateEmployeeRole();
    const categories = this.getAll();
    const trimmedName = name?.trim();

    if (!trimmedName) throw new Error('Category name cannot be empty.');
    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error('Category already registered.');
    }

    const all: Category[] = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const nextId = all.length > 0 ? Math.max(...all.map(c => c.id)) + 1 : 1;
    const newCategory: Category = { id: nextId, name: trimmedName, active: true };
    all.push(newCategory);
    this.save(all);
    return newCategory;
  }

  atualizarCategoria(updated: Category): Category {
    this.validateEmployeeRole();
    if (!updated || !updated.name?.trim()) throw new Error('Category name cannot be empty.');

    const all: Category[] = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const idx = all.findIndex(c => c.id === updated.id);
    if (idx === -1) throw new Error('Category not found.');

    if (all.some(c => c.id !== updated.id && c.name.toLowerCase() === updated.name.trim().toLowerCase())) {
      throw new Error('Another category with this name already exists.');
    }

    all[idx] = { ...all[idx], name: updated.name.trim() };
    this.save(all);
    return all[idx];
  }

  removerCategoria(id: number): void {
    this.validateEmployeeRole();
    const all: Category[] = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category does not exist.');

    all[idx] = { ...all[idx], active: false }; 
    this.save(all);
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