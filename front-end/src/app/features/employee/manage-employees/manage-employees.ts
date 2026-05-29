import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../authentication/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { SnackConfig } from '../../../shared/services/snack-config';

interface EmployeeForm {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

@Component({
  selector: 'app-manage-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './manage-employees.html',
})
export class ManageEmployeesComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly userService = inject(UserService);
  private readonly snackConfig = inject(SnackConfig);
  private readonly destroy$ = new Subject<void>();

  employees: User[] = [];
  currentUserId = 0;

  showAddForm = false;
  newForm: EmployeeForm = { name: '', email: '', password: '', birthDate: '' };

  editingId: number | null = null;
  editForm: EmployeeForm & { changePassword: boolean } = {
    name: '', email: '', password: '', birthDate: '', changePassword: false,
  };

  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getLoggedInUser()?.id ?? 0;
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.userService.getEmployees().pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => this.employees = employees,
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar funcionários', 'Fechar', this.snackConfig.long),
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newForm = { name: '', email: '', password: '', birthDate: '' };
    this.editingId = null;
    this.confirmDeleteId = null;
  }

  addEmployee(): void {
    try {
      const result = this.userService.addEmployee(this.newForm);
      this.showAddForm = false;
      this.newForm = { name: '', email: '', password: '', birthDate: '' };
      this.load();
      this.snackBar.open('Funcionário cadastrado com sucesso!', 'Fechar', this.snackConfig.default);
    } catch (e: any) {
      this.snackBar.open(e?.message || 'Erro ao cadastrar funcionário', 'Fechar', this.snackConfig.long);
    }
  }

  startEdit(emp: User): void {
    this.editingId = emp.id;
    this.editForm = {
      name: emp.name,
      email: emp.email,
      password: '',
      birthDate: emp.birthDate ?? '',
      changePassword: false,
    };
    this.confirmDeleteId = null;
    this.showAddForm = false;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(emp: User): void {
    const data: any = {
      name: this.editForm.name,
      email: this.editForm.email,
      birthDate: this.editForm.birthDate,
    };
    if (this.editForm.changePassword && this.editForm.password?.trim()) {
      data.password = this.editForm.password.trim();
    }
    try {
      this.userService.updateEmployee(emp.id, data);
      this.cancelEdit();
      this.load();
      this.snackBar.open('Funcionário atualizado!', 'Fechar', this.snackConfig.default);
    } catch (e: any) {
      this.snackBar.open(e?.message || 'Erro ao atualizar funcionário', 'Fechar', this.snackConfig.long);
    }
  }

  askDelete(id: number): void {
    this.confirmDeleteId = id;
    this.editingId = null;
    this.showAddForm = false;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(id: number): void {
    const loggedUser = this.authService.getLoggedInUser();
    if (!loggedUser) {
      this.snackBar.open(
        'Usuário não autenticado.',
        'Fechar',
        this.snackConfig.error
      );
      return;
    }

    try {
      this.userService.removeEmployee(id, loggedUser.id);
      this.confirmDeleteId = null;
      this.load();
      this.snackBar.open(
        'Funcionário removido.',
        'Fechar',
        this.snackConfig.default
      );
    } catch (e: any) {
      this.snackBar.open(
        e?.message || 'Erro ao remover funcionário',
        'Fechar',
        this.snackConfig.error
      );
    }
  }
  
  formatDate(date?: string): string {
    if (!date) return '—';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  canDelete(emp: User): boolean {
    return emp.id !== this.currentUserId && this.employees.length > 1;
  }
}
