import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';
import { User } from '../../../shared/models/user.model';
import { MaintenanceDialogComponent } from '../maintenance-dialog/maintenance-dialog';
import { FinalizeDialogComponent } from '../finalize-dialog/finalize-dialog';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog';
import { SolicitationDetailDialogComponent } from '../solicitation-detail-dialog/solicitation-detail-dialog';
import { UserService } from '../../../shared/services/user.service';
import { SnackConfig } from '../../../shared/services/snack-config';

type FilterMode = 'TODAY' | 'PERIOD' | 'ALL';

interface StatusStyle {
  label: string;
  rowClass: string;
  badgeClass: string;
}

const STATUS_STYLE: Record<RequestStatus, StatusStyle> = {
  [RequestStatus.OPEN]:       { label: 'Aberta',         rowClass: 'table-secondary', badgeClass: 'badge-open'       },
  [RequestStatus.QUOTED]:     { label: 'Orçada',         rowClass: 'row-quoted',      badgeClass: 'badge-quoted'     },
  [RequestStatus.REJECTED]:   { label: 'Rejeitada',      rowClass: 'table-danger',    badgeClass: 'badge-rejected'   },
  [RequestStatus.APPROVED]:   { label: 'Aprovada',       rowClass: 'row-approved',    badgeClass: 'badge-approved'   },
  [RequestStatus.REDIRECTED]: { label: 'Redirecionada',  rowClass: 'row-redirected',  badgeClass: 'badge-redirected' },
  [RequestStatus.FIXED]:      { label: 'Arrumada',       rowClass: 'table-primary',   badgeClass: 'badge-fixed'      },
  [RequestStatus.PAID]:       { label: 'Paga',           rowClass: 'row-paid',        badgeClass: 'badge-paid'       },
  [RequestStatus.FINALIZED]:  { label: 'Finalizada',     rowClass: 'table-success',   badgeClass: 'badge-finalized'  },
};

@Component({
  selector: 'app-solicitations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './solicitations-list.html',
  styleUrl: './solicitations-list.css',
})
export class SolicitationsListComponent implements OnInit, OnDestroy {
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly userService = inject(UserService);
  private readonly snackConfig = inject(SnackConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  filterMode: FilterMode = 'ALL';
  periodStart = '';
  periodEnd = '';

  requests: Solicitation[] = [];
  allRequests: Solicitation[] = [];
  allUsers: User[] = [];
  employees: User[] = [];
  currentEmployeeId = 0;

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    this.currentEmployeeId = user?.id ?? 0;
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshData(): void {
    this.loadRequests();

    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.allUsers = users;
        this.cdr.detectChanges(); 
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar usuários', 'Fechar', this.snackConfig.default),
    });

    this.userService.getEmployees().pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.cdr.detectChanges();
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar funcionários', 'Fechar', this.snackConfig.default),
    });
  }

  private loadRequests(): void {
    this.storageService.getRequests().pipe(takeUntil(this.destroy$)).subscribe({
      next: (requests) => {
        this.allRequests = requests;
        this.applyFilter();
        this.cdr.detectChanges(); 
      },
      error: (e: any) => this.snackBar.open(e?.message || 'Erro ao carregar solicitações', 'Fechar', this.snackConfig.default),
    });
  }

  applyFilter(): void {
    const empId = this.currentEmployeeId;
    let filtered = this.allRequests.filter((r) => {
      if (r.status === RequestStatus.REDIRECTED) {
        return r.redirectedToEmployeeId === empId;
      }
      return true;
    });

    if (this.filterMode === 'TODAY') {
      const today = new Date().toDateString();
      filtered = filtered.filter((r) => new Date(r.openedAt).toDateString() === today);
    } else if (this.filterMode === 'PERIOD' && this.periodStart && this.periodEnd) {
      const start = new Date(this.periodStart + 'T00:00:00');
      const end = new Date(this.periodEnd + 'T23:59:59');
      filtered = filtered.filter((r) => {
        const d = new Date(r.openedAt);
        return d >= start && d <= end;
      });
    }

    this.requests = filtered.sort(
      (a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime(),
    );
  }

  setFilter(mode: FilterMode): void {
    this.filterMode = mode;
    this.applyFilter();
  }

  getStyle(status: RequestStatus): StatusStyle {
    return STATUS_STYLE[status] ?? { label: status, rowClass: '', badgeClass: '' };
  }

  getShortDesc(desc: string): string {
    if (!desc) return '—';
    return desc.length <= 30 ? desc : desc.substring(0, 27) + '...';
  }

  showMaintenanceButton(req: Solicitation): boolean {
    if (req.status === RequestStatus.APPROVED) return true;
    if (req.status === RequestStatus.REDIRECTED && req.redirectedToEmployeeId === this.currentEmployeeId) return true;
    return false;
  }

  showFinalizeButton(req: Solicitation): boolean {
    return req.status === RequestStatus.PAID;
  }

  onDoQuote(request: Solicitation): void {
    const client = this.allUsers.find((u) => u.id === request.clientId);

    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '560px',
      data: { request, client },
    });

    dialogRef.afterClosed().subscribe((quoteValue: number | null) => {
      if (quoteValue && quoteValue > 0) {
        const user = this.authService.getLoggedInUser();
        const now = new Date().toISOString();
        const history = [
          ...(request.history || []),
          {
            date: now,
            fromStatus: request.status,
            toStatus: RequestStatus.QUOTED,
            employeeId: user?.id,
            employeeName: user?.name,
            note: `Orçamento de R$ ${quoteValue.toFixed(2).replace('.', ',')}`,
          },
        ];
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
            this.snackBar.open(`Orçamento de ${formatted} registrado!`, 'Fechar', this.snackConfig.long);
            this.loadRequests();
          },
          error: (e: any) => this.snackBar.open(e?.message || 'Erro ao registrar orçamento', 'Fechar', this.snackConfig.default),
        });
      }
    });
  }

  onDoMaintenance(req: Solicitation): void {
    const employees = this.employees.filter((e) => e.id !== this.currentEmployeeId);
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, {
      width: '600px',
      data: { request: req, employees },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      const user = this.authService.getLoggedInUser();
      const now = new Date().toISOString();

      if (result.action === 'MAINTAIN') {
        const history = [
          ...(req.history || []),
          { date: now, fromStatus: req.status, toStatus: RequestStatus.FIXED, employeeId: user?.id, employeeName: user?.name, note: 'Manutenção efetuada' },
        ];
        this.storageService.updateRequest(req.id, {
          status: RequestStatus.FIXED,
          maintenanceDescription: result.maintenanceDescription,
          clientOrientations: result.clientOrientations,
          maintainedByEmployeeId: user?.id,
          maintainedByEmployeeName: user?.name,
          maintainedAt: now,
          history,
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.snackBar.open('Manutenção registrada com sucesso!', 'Fechar', this.snackConfig.default);
            this.loadRequests();
          },
          error: (e: any) => this.snackBar.open(e?.message || 'Erro ao registrar manutenção', 'Fechar', this.snackConfig.default),
        });
      } else if (result.action === 'REDIRECT') {
        const target = this.allUsers.find((u) => u.id === result.targetEmployeeId);
        const history = [
          ...(req.history || []),
          { date: now, fromStatus: req.status, toStatus: RequestStatus.REDIRECTED, employeeId: user?.id, employeeName: user?.name, note: `Redirecionado para ${target?.name ?? '#' + result.targetEmployeeId}` },
        ];
        this.storageService.updateRequest(req.id, {
          status: RequestStatus.REDIRECTED,
          redirectedToEmployeeId: result.targetEmployeeId,
          redirectedToEmployeeName: target?.name,
          history,
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.snackBar.open('Solicitação redirecionada!', 'Fechar', this.snackConfig.default);
            this.loadRequests();
          },
          error: (e: any) => this.snackBar.open(e?.message || 'Erro ao redirecionar solicitação', 'Fechar', this.snackConfig.default),
        });
      }
    });
  }

  onFinalize(req: Solicitation): void {
    const dialogRef = this.dialog.open(FinalizeDialogComponent, {
      width: '480px',
      data: { request: req },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const user = this.authService.getLoggedInUser();
      const now = new Date().toISOString();
      const history = [
        ...(req.history || []),
        { date: now, fromStatus: req.status, toStatus: RequestStatus.FINALIZED, employeeId: user?.id, employeeName: user?.name, note: 'Solicitação finalizada' },
      ];
      this.storageService.updateRequest(req.id, {
        status: RequestStatus.FINALIZED,
        finalizedByEmployeeId: user?.id,
        finalizedByEmployeeName: user?.name,
        finalizedAt: now,
        history,
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Solicitação finalizada!', 'Fechar', this.snackConfig.default);
          this.loadRequests();
        },
        error: (e: any) => this.snackBar.open(e?.message || 'Erro ao finalizar solicitação', 'Fechar', this.snackConfig.default),
      });
    });
  }

  onViewDetails(req: Solicitation): void {
    this.dialog.open(SolicitationDetailDialogComponent, {
      width: '580px',
      data: { request: req },
    });
  }
}