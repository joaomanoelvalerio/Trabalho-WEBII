import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog';
import { StorageService } from '../../../shared/services/storage';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../authentication/services/auth.service';
import { SnackConfig } from '../../../shared/services/snack-config';

const SHORT_DESC_LIMIT = 30;

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.css',
})
export class Employee implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly storageService = inject(StorageService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackConfig = inject(SnackConfig);
  private readonly destroy$ = new Subject<void>();

  requests: Solicitation[] = [];
  allUsers: User[] = [];

  ngOnInit(): void {
    this.loadRequests();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => this.allUsers = users,
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar usuários', 'Fechar', this.snackConfig.default),
    });
  }

  loadRequests(): void {
    this.storageService.getOpenRequests().pipe(takeUntil(this.destroy$)).subscribe({
      next: (requests) => {
        this.requests = requests.sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar solicitações', 'Fechar', this.snackConfig.default),
    });
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
    const client = this.allUsers.find(u => u.id === request.clientId);

    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '560px',
      data: { request, client },
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
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            const formatted = quoteValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            this.snackBar.open(`Orçamento de ${formatted} registrado com sucesso!`, 'Fechar', this.snackConfig.long);
            this.loadRequests();
          },
          error: (e: any) => this.snackBar.open(e?.message || 'Erro ao registrar orçamento', 'Fechar', this.snackConfig.default),
        });
      }
    });
  }
}