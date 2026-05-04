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

  /**
   * Inicializa o localStorage com categorias padrão caso ainda não existam.
   * Executado uma única vez na construção do serviço.
   */
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

  /** Retorna todas as categorias cadastradas. */
  getAll(): Category[] {
    const stored = localStorage.getItem(this.KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /** Busca uma categoria pelo ID. Retorna undefined se não encontrada. */
  getCategoriaById(id: number): Category | undefined {
    return this.getAll().find((c) => c.id === id);
  }

  /**
   * Cadastra uma nova categoria.
   * Requer que o usuário logado seja um funcionário (EMPLOYEE).
   * @throws Error se o nome estiver vazio ou já existir outra categoria com o mesmo nome.
   */
  registerCategory(name: string): Category {
    this.validateEmployeeRole();
    const categories = this.getAll();
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

  /**
   * Atualiza o nome de uma categoria existente.
   * Requer que o usuário logado seja um funcionário (EMPLOYEE).
   * @throws Error se o nome estiver vazio, a categoria não for encontrada ou o nome já estiver em uso.
   */
  atualizarCategoria(updated: Category): Category {
    this.validateEmployeeRole();
    if (!updated || !updated.name?.trim()) {
      throw new Error('Category name cannot be empty.');
    }

    const categories = this.getAll();
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

  /**
   * Remove uma categoria pelo ID.
   * Requer que o usuário logado seja um funcionário (EMPLOYEE).
   * @throws Error se a categoria não existir.
   */
  removerCategoria(id: number): void {
    this.validateEmployeeRole();
    const categories = this.getAll();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error('Category does not exist.');
    }

    categories.splice(idx, 1);
    this.save(categories);
  }

  /** Persiste a lista de categorias no localStorage. */
  private save(categories: Category[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(categories));
  }

  /**
   * Verifica se o usuário logado possui a role EMPLOYEE.
   * Lança erro caso contrário, protegendo operações de escrita.
   */
  private validateEmployeeRole(): void {
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'EMPLOYEE') {
      throw new Error('Only employees can modify categories.');
    }
  }
}