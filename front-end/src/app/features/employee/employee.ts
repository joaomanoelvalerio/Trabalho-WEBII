import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule }   from '@angular/material/table';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule }    from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog';
import { RequestStatus } from '../../shared/models/solicitation.model';
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
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    CommonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: string[] = ['openedAt', 'clientName', 'equipmentDescription', 'actions'];

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