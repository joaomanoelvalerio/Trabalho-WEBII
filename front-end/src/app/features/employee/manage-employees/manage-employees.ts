import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../authentication/services/auth.service';
import { User } from '../../../shared/models/user.model';

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
export class ManageEmployeesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  employees: User[] = [];
  currentUserId = 0;

  // Formulário de adição
  showAddForm = false;
  newForm: EmployeeForm = { name: '', email: '', password: '', birthDate: '' };

  // Edição
  editingId: number | null = null;
  editForm: EmployeeForm & { changePassword: boolean } = {
    name: '', email: '', password: '', birthDate: '', changePassword: false,
  };

  // Remoção
  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getLoggedInUser()?.id ?? 0;
    this.load();
  }

  load(): void {
    this.employees = this.authService.getEmployees();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newForm = { name: '', email: '', password: '', birthDate: '' };
    this.editingId = null;
    this.confirmDeleteId = null;
  }

  addEmployee(): void {
    try {
      this.authService.addEmployee(this.newForm);
      this.showAddForm = false;
      this.newForm = { name: '', email: '', password: '', birthDate: '' };
      this.load();
      this.snackBar.open('Funcionário cadastrado com sucesso!', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
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
    try {
      const data: any = {
        name: this.editForm.name,
        email: this.editForm.email,
        birthDate: this.editForm.birthDate,
      };
      if (this.editForm.changePassword && this.editForm.password?.trim()) {
        data.password = this.editForm.password.trim();
      }
      this.authService.updateEmployee(emp.id, data);
      this.cancelEdit();
      this.load();
      this.snackBar.open('Funcionário atualizado!', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
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
    try {
      this.authService.removeEmployee(id);
      this.confirmDeleteId = null;
      this.load();
      this.snackBar.open('Funcionário removido.', 'Fechar', { duration: 3000, horizontalPosition: 'end' });
    } catch (e: any) {
      this.snackBar.open(e.message, 'Fechar', { duration: 4000, horizontalPosition: 'end' });
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