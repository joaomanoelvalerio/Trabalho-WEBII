import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog';
import { StorageService } from '../../shared/services/storage';
import { RequestStatus, Solicitation } from '../../shared/models/solicitation.model';
import { AuthService } from '../authentication/services/auth.service';

const SHORT_DESC_LIMIT = 30;

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  requests: Solicitation[] = [];

  ngOnInit(): void { this.loadRequests(); }

  loadRequests(): void {
    this.requests = this.storageService
      .getOpenRequests()
      .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
  }

  getShortDescription(description: string): string {
    if (!description) return '—';
    return description.length <= SHORT_DESC_LIMIT
      ? description
      : description.substring(0, SHORT_DESC_LIMIT - 3) + '...';
  }

  isTruncated(description: string): boolean {
    return !!description && description.length > SHORT_DESC_LIMIT;
  }

  getClientName(req: Solicitation): string {
    return req.clientName || `Cliente #${req.clientId}`;
  }

  goToSolicitations(): void {
    this.router.navigate(['/employee/solicitations']);
  }

  onSubmitQuote(request: Solicitation): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '500px',
      data: { request },
    });

    dialogRef.afterClosed().subscribe((quoteValue: number | null) => {
      if (quoteValue && quoteValue > 0) {
        const user = this.authService.getLoggedInUser();
        const now = new Date().toISOString();
        const history = [...(request.history || []), {
          date: now,
          fromStatus: request.status,
          toStatus: RequestStatus.QUOTED,
          employeeId: user?.id,
          employeeName: user?.name,
          note: `Orçamento de R$ ${quoteValue.toFixed(2).replace('.', ',')}`,
        }];
        this.storageService.updateRequest(request.id, {
          status: RequestStatus.QUOTED,
          quoteValue,
          quotedByEmployeeId: user?.id,
          quotedByEmployeeName: user?.name,
          quotedAt: now,
          history,
        });
        const formatted = quoteValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.snackBar.open(`Orçamento de ${formatted} registrado com sucesso!`, 'Fechar', {
          duration: 4000, horizontalPosition: 'end', verticalPosition: 'bottom',
        });
        this.loadRequests();
      }
    });
  }
}