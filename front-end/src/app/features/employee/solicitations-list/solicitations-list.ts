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
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog';
import { SolicitationDetailDialogComponent } from '../solicitation-detail-dialog/solicitation-detail-dialog';

type FilterMode = 'TODAY' | 'PERIOD' | 'ALL';

interface StatusStyle {
  label: string;
  rowClass: string;
  badgeClass: string;
}

/** Mapeamento de cada status para seu label e classes CSS de badge/linha da tabela. */
const STATUS_STYLE: Record<RequestStatus, StatusStyle> = {
  [RequestStatus.OPEN]:       { label: 'Aberta',         rowClass: 'table-secondary', badgeClass: 'badge-open'       },
  [RequestStatus.QUOTED]:     { label: 'Orçada',         rowClass: 'row-quoted',      badgeClass: 'badge-quoted'     },
  [RequestStatus.REJECTED]:   { label: 'Rejeitada',      rowClass: 'table-danger',    badgeClass: 'badge-rejected'   },
  [RequestStatus.APPROVED]:   { label: 'Aprovada',       rowClass: 'row-approved',    badgeClass: 'badge-approved'   },
  [RequestStatus.REDIRECTED]: { label: 'Redirecionada',  rowClass: 'row-redirected',  badgeClass: 'badge-redirected' },
  [RequestStatus.FIXED]:      { label: 'Arrumada',       rowClass: 'table-primary',   badgeClass: 'badge-fixed'      },
  [RequestStatus.PAID]:       { label: 'Paga',           rowClass: 'row-paid',        badgeClass: 'badge-paid'       },
  [RequestStatus.FINALIZED]:  { label: 'Finalizada',     rowClass: 'table-success',   badgeClass: 'badge-finalized'  },
  [RequestStatus.IN_PROGRESS]:{ label: 'Em Andamento',   rowClass: 'row-progress',    badgeClass: 'badge-progress'   },
};

/** Configuração padrão do snackbar — canto superior direito, longe da tabela. */
const SNACK = {
  duration: 3000,
  horizontalPosition: 'end' as const,
  verticalPosition: 'top' as const,
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

  /** Modo de filtro de data ativo: hoje, período ou todas. */
  filterMode: FilterMode = 'ALL';

  /** Data de início do filtro por período (formato YYYY-MM-DD). */
  periodStart = '';

  /** Data de fim do filtro por período (formato YYYY-MM-DD). */
  periodEnd = '';

  /** Solicitações exibidas após aplicação dos filtros. */
  requests: Solicitation[] = [];

  /** ID do funcionário logado, usado para filtrar redirecionamentos. */
  currentEmployeeId = 0;

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    this.currentEmployeeId = user?.id ?? 0;
    this.applyFilter();
  }

  /**
   * Aplica os filtros de período sobre todas as solicitações.
   * Solicitações REDIRECTED só aparecem para o funcionário-destino.
   */
  applyFilter(): void {
    const empId = this.currentEmployeeId;
    let filtered = this.storageService.getRequests().filter((r) => {
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

    // Ordena do mais antigo ao mais recente
    this.requests = filtered.sort(
      (a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime(),
    );
  }

  /** Altera o modo de filtro e reaplica imediatamente. */
  setFilter(mode: FilterMode): void {
    this.filterMode = mode;
    this.applyFilter();
  }

  /** Retorna as classes CSS e o label de exibição para um dado status. */
  getStyle(status: RequestStatus): StatusStyle {
    return STATUS_STYLE[status] ?? { label: status, rowClass: '', badgeClass: '' };
  }

  /** Trunca a descrição do equipamento para 30 caracteres para exibição na tabela. */
  getShortDesc(desc: string): string {
    if (!desc) return '—';
    return desc.length <= 30 ? desc : desc.substring(0, 27) + '...';
  }

  /**
   * Verifica se o botão de manutenção deve ser exibido.
   * Aparece para solicitações APPROVED ou REDIRECTED ao funcionário atual.
   */
  showMaintenanceButton(req: Solicitation): boolean {
    if (req.status === RequestStatus.APPROVED) return true;
    if (req.status === RequestStatus.REDIRECTED && req.redirectedToEmployeeId === this.currentEmployeeId) return true;
    return false;
  }

  /** Verifica se o botão de finalização deve ser exibido (status PAID). */
  showFinalizeButton(req: Solicitation): boolean {
    return req.status === RequestStatus.PAID;
  }

  /**
   * Abre o dialog de orçamento para uma solicitação OPEN.
   * Ao confirmar, atualiza o status para QUOTED e registra no histórico.
   */
  onDoQuote(request: Solicitation): void {
    const allUsers = this.authService.getAllUsers();
    const client = allUsers.find((u) => u.id === request.clientId);

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
        });
        const formatted = quoteValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.snackBar.open(`Orçamento de ${formatted} registrado!`, 'Fechar', { ...SNACK, duration: 4000 });
        this.applyFilter();
      }
    });
  }

  /**
   * Abre o dialog de manutenção para uma solicitação APPROVED ou REDIRECTED.
   * O funcionário pode registrar a manutenção (→ FIXED) ou redirecionar (→ REDIRECTED).
   */
  onDoMaintenance(req: Solicitation): void {
    const employees = this.authService.getEmployees().filter((e) => e.id !== this.currentEmployeeId);
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
        });
        this.snackBar.open('Manutenção registrada com sucesso!', 'Fechar', SNACK);
      } else if (result.action === 'REDIRECT') {
        const target = this.authService.getAllUsers().find((u) => u.id === result.targetEmployeeId);
        const history = [
          ...(req.history || []),
          { date: now, fromStatus: req.status, toStatus: RequestStatus.REDIRECTED, employeeId: user?.id, employeeName: user?.name, note: `Redirecionado para ${target?.name ?? '#' + result.targetEmployeeId}` },
        ];
        this.storageService.updateRequest(req.id, {
          status: RequestStatus.REDIRECTED,
          redirectedToEmployeeId: result.targetEmployeeId,
          redirectedToEmployeeName: target?.name,
          history,
        });
        this.snackBar.open('Solicitação redirecionada!', 'Fechar', SNACK);
        this.applyFilter();
      }

      this.applyFilter();
    });
  }

  /**
   * Abre o dialog de finalização para uma solicitação PAID.
   * Ao confirmar, atualiza o status para FINALIZED e registra no histórico.
   */
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
      });
      this.snackBar.open('Solicitação finalizada!', 'Fechar', SNACK);
      this.applyFilter();
    });
  }

  /** Abre o dialog de detalhes de uma solicitação em modo somente leitura. */
  onViewDetails(req: Solicitation): void {
    this.dialog.open(SolicitationDetailDialogComponent, {
      width: '580px',
      data: { request: req },
    });
  }
}