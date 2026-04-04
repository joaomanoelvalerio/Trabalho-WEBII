import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { RequestStatus, Solicitation } from '../../../shared/models/solicitation.model';
import { MaintenanceDialogComponent } from '../maintenance-dialog/maintenance-dialog';
import { FinalizeDialogComponent } from '../finalize-dialog/finalize-dialog';

type FilterMode = 'TODAY' | 'PERIOD' | 'ALL';

interface StatusStyle { label: string; rowClass: string; badgeClass: string; }

const STATUS_STYLE: Record<RequestStatus, StatusStyle> = {
  [RequestStatus.OPEN]:        { label: 'Aberta',        rowClass: 'row-open',       badgeClass: 'badge-open'       },
  [RequestStatus.QUOTED]:      { label: 'Orçada',        rowClass: 'row-quoted',     badgeClass: 'badge-quoted'     },
  [RequestStatus.REJECTED]:    { label: 'Rejeitada',     rowClass: 'row-rejected',   badgeClass: 'badge-rejected'   },
  [RequestStatus.APPROVED]:    { label: 'Aprovada',      rowClass: 'row-approved',   badgeClass: 'badge-approved'   },
  [RequestStatus.REDIRECTED]:  { label: 'Redirecionada', rowClass: 'row-redirected', badgeClass: 'badge-redirected' },
  [RequestStatus.FIXED]:       { label: 'Arrumada',      rowClass: 'row-fixed',      badgeClass: 'badge-fixed'      },
  [RequestStatus.PAID]:        { label: 'Paga',          rowClass: 'row-paid',       badgeClass: 'badge-paid'       },
  [RequestStatus.FINALIZED]:   { label: 'Finalizada',    rowClass: 'row-finalized',  badgeClass: 'badge-finalized'  },
  [RequestStatus.IN_PROGRESS]: { label: 'Em Andamento',  rowClass: 'row-progress',   badgeClass: 'badge-progress'   },
};

@Component({
  selector: 'app-solicitations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './solicitations-list.html',
  styleUrl: './solicitations-list.css',
})
export class SolicitationsListComponent implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  filterMode: FilterMode = 'ALL';
  periodStart = '';
  periodEnd = '';
  requests: Solicitation[] = [];
  currentEmployeeId = 0;

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    this.currentEmployeeId = user?.id ?? 0;
    this.applyFilter();
  }

  applyFilter(): void {
    const empId = this.currentEmployeeId;
    let filtered = this.storageService.getRequests().filter(r => {
      if (r.status === RequestStatus.REDIRECTED) {
        return r.redirectedToEmployeeId === empId;
      }
      return true;
    });

    if (this.filterMode === 'TODAY') {
      const today = new Date().toDateString();
      filtered = filtered.filter(r => new Date(r.openedAt).toDateString() === today);
    } else if (this.filterMode === 'PERIOD' && this.periodStart && this.periodEnd) {
      const start = new Date(this.periodStart + 'T00:00:00');
      const end   = new Date(this.periodEnd   + 'T23:59:59');
      filtered = filtered.filter(r => {
        const d = new Date(r.openedAt);
        return d >= start && d <= end;
      });
    }

    this.requests = filtered.sort(
      (a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime()
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

  onDoMaintenance(req: Solicitation): void {
    const employees = this.authService.getEmployees().filter(e => e.id !== this.currentEmployeeId);
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, {
      width: '600px',
      data: { request: req, employees },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      const user = this.authService.getLoggedInUser();
      const now = new Date().toISOString();

      if (result.action === 'MAINTAIN') {
        const history = [...(req.history || []), {
          date: now, fromStatus: req.status, toStatus: RequestStatus.FIXED,
          employeeId: user?.id, employeeName: user?.name, note: 'Manutenção efetuada',
        }];
        this.storageService.updateRequest(req.id, {
          status: RequestStatus.FIXED,
          maintenanceDescription: result.maintenanceDescription,
          clientOrientations: result.clientOrientations,
          maintainedByEmployeeId: user?.id,
          maintainedByEmployeeName: user?.name,
          maintainedAt: now,
          history,
        });
        this.snackBar.open('Manutenção registrada com sucesso!', 'Fechar', { duration: 3000 });

      } else if (result.action === 'REDIRECT') {
        const target = this.authService.getAllUsers().find(u => u.id === result.targetEmployeeId);
        const history = [...(req.history || []), {
          date: now, fromStatus: req.status, toStatus: RequestStatus.REDIRECTED,
          employeeId: user?.id, employeeName: user?.name,
          note: `Redirecionado para ${target?.name ?? '#' + result.targetEmployeeId}`,
        }];
        this.storageService.updateRequest(req.id, {
          status: RequestStatus.REDIRECTED,
          redirectedToEmployeeId: result.targetEmployeeId,
          redirectedToEmployeeName: target?.name,
          history,
        });
        this.snackBar.open('Solicitação redirecionada!', 'Fechar', { duration: 3000 });
      }

      this.applyFilter();
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
      const history = [...(req.history || []), {
        date: now, fromStatus: req.status, toStatus: RequestStatus.FINALIZED,
        employeeId: user?.id, employeeName: user?.name, note: 'Solicitação finalizada',
      }];
      this.storageService.updateRequest(req.id, {
        status: RequestStatus.FINALIZED,
        finalizedByEmployeeId: user?.id,
        finalizedByEmployeeName: user?.name,
        finalizedAt: now,
        history,
      });
      this.snackBar.open('Solicitação finalizada!', 'Fechar', { duration: 3000 });
      this.applyFilter();
    });
  }
}