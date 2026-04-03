import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog';
import { StorageService } from '../../shared/services/storage';
import { RequestStatus, Solicitation } from '../../shared/models/solicitation.model';

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

  requests: Solicitation[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

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

  onSubmitQuote(request: Solicitation): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '500px',
      data: { request },
    });

    dialogRef.afterClosed().subscribe((quoteValue: number | null) => {
      if (quoteValue && quoteValue > 0) {
        this.storageService.updateRequestStatus(request.id, RequestStatus.QUOTED);
        const formatted = quoteValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        this.snackBar.open(`Orçamento de ${formatted} registrado com sucesso!`, 'Fechar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        this.loadRequests();
      }
    });
  }
}