import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule }   from '@angular/material/table';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule }    from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog';
import { RequestStatus } from '../../shared/models/solicitation.model';
import { Category } from '../../shared/models/category.model';
import { User } from '../../shared/models/user.model';
import { CategoryService } from '../../shared/services/category.service';
import { AuthService } from '../authentication/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface EmployeeRequest {
  id: number;
  openedAt: Date;
  clientName: string;
  equipmentDescription: string;
  defectDescription: string;
  status: RequestStatus;
}

const SHORT_DESC_LIMIT = 30;

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: string[] = ['openedAt', 'clientName', 'equipmentDescription', 'actions'];

  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  categories: Category[] = [];
  isEmployee = false;
  selectedCategory: Category | null = null;
  newCategoryName = '';

  employees: User[] = [];
  selectedEmployee: User | null = null;
  employeeForm = {
    name: '',
    email: '',
    birthDate: '',
    password: '',
  };

  requests: EmployeeRequest[] = [
    {
      id: 1,
      openedAt: new Date('2024-03-01T10:00:00'),
      clientName: 'João Silva',
      equipmentDescription: 'Notebook Dell não liga após queda',
      defectDescription: 'O notebook caiu do escritório e não liga mais. Sem sinal de vida.',
      status: RequestStatus.OPEN,
    },
    {
      id: 2,
      openedAt: new Date('2024-03-02T14:30:00'),
      clientName: 'Maria Souza',
      equipmentDescription: 'Celular Samsung com tela quebrada',
      defectDescription: 'Tela completamente rachada após queda. Touch não responde.',
      status: RequestStatus.OPEN,
    },
    {
      id: 3,
      openedAt: new Date('2024-03-03T09:00:00'),
      clientName: 'José Oliveira',
      equipmentDescription: 'Impressora HP sem imprimir',
      defectDescription: 'Impressora para de imprimir no meio do documento.',
      status: RequestStatus.OPEN,
    },
  ];

  ngOnInit(): void {
    this.requests.sort((a, b) => a.openedAt.getTime() - b.openedAt.getTime());
    this.categories = this.categoryService.getCategorias();
    this.isEmployee = this.authService.getLoggedInUser()?.role === 'EMPLOYEE';
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employees = this.authService.getEmployees();
  }

  prepareNewEmployee(): void {
    this.selectedEmployee = null;
    this.employeeForm = { name: '', email: '', birthDate: '', password: '' };
  }

  editEmployee(employee: User): void {
    this.selectedEmployee = { ...employee };
    this.employeeForm = {
      name: employee.name,
      email: employee.email,
      birthDate: employee.birthDate ?? '',
      password: '',
    };
  }

  saveEmployee(): void {
    if (!this.isEmployee) return;

    try {
      if (this.selectedEmployee) {
        this.authService.updateEmployee(this.selectedEmployee.id, {
          name: this.employeeForm.name,
          email: this.employeeForm.email,
          birthDate: this.employeeForm.birthDate,
          password: this.employeeForm.password,
        });
      } else {
        this.authService.addEmployee({
          name: this.employeeForm.name,
          email: this.employeeForm.email,
          birthDate: this.employeeForm.birthDate,
          password: this.employeeForm.password,
        });
      }
      this.loadEmployees();
      this.prepareNewEmployee();
      this.snackBar.open('Dados de empregado salvos com sucesso.', 'Fechar', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Erro ao salvar empregado.', 'Fechar', { duration: 4000 });
    }
  }

  cancelEditEmployee(): void {
    this.prepareNewEmployee();
  }

  removeEmployee(id: number): void {
    if (!this.isEmployee) return;

    try {
      this.authService.removeEmployee(id);
      this.loadEmployees();
      this.snackBar.open('Empregado removido com sucesso.', 'Fechar', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Erro ao remover empregado.', 'Fechar', { duration: 4000 });
    }
  }

  carregarCategorias(): void {
    this.categories = this.categoryService.getCategorias();
  }

  adicionarCategoria(): void {
    if (!this.isEmployee) return;
    try {
      this.categoryService.cadastrarCategoria(this.newCategoryName);
      this.newCategoryName = '';
      this.carregarCategorias();
      this.snackBar.open('Categoria adicionada com sucesso.', 'Fechar', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Erro ao adicionar categoria.', 'Fechar', { duration: 4000 });
    }
  }

  editarCategoria(categoria: Category): void {
    if (!this.isEmployee) return;
    this.selectedCategory = { ...categoria };
    this.newCategoryName = categoria.name;
  }

  salvarCategoria(): void {
    if (!this.isEmployee || !this.selectedCategory) return;

    try {
      this.categoryService.atualizarCategoria({ ...this.selectedCategory, name: this.newCategoryName });
      this.selectedCategory = null;
      this.newCategoryName = '';
      this.carregarCategorias();
      this.snackBar.open('Categoria atualizada com sucesso.', 'Fechar', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Erro ao atualizar categoria.', 'Fechar', { duration: 4000 });
    }
  }

  cancelarEdicao(): void {
    this.selectedCategory = null;
    this.newCategoryName = '';
  }

  excluirCategoria(id: number): void {
    if (!this.isEmployee) return;

    try {
      this.categoryService.removerCategoria(id);
      this.carregarCategorias();
      this.snackBar.open('Categoria removida com sucesso.', 'Fechar', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(error?.message ?? 'Erro ao remover categoria.', 'Fechar', { duration: 4000 });
    }
  }

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length <= SHORT_DESC_LIMIT
      ? description
      : description.substring(0, SHORT_DESC_LIMIT - 3) + '...';
  }

  isTruncated(description: string): boolean {
    return description.length > SHORT_DESC_LIMIT;
  }

 private snackBar = inject(MatSnackBar);

onSubmitQuote(request: EmployeeRequest): void {
  const dialogRef = this.dialog.open(QuoteDialogComponent, {
    width: '480px',
    data: { request },
  });

  dialogRef.afterClosed().subscribe((quoteValue: number | null) => {
    if (quoteValue !== null && quoteValue > 0) {
      request.status = RequestStatus.QUOTED;

      const formattedValue = quoteValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      this.snackBar.open(`Orçamento registrado: ${formattedValue}`, 'Fechar', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['bg-success', 'text-white']
      });
    }
  });
  }
}