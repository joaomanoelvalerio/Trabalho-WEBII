import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../../shared/services/report.service';
import { SnackConfig } from '../../../shared/services/snack-config';

@Component({
  selector: 'app-revenue-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './revenue-reports.html'
})
export class RevenueReportsComponent implements OnDestroy {
  private reportService = inject(ReportService);
  private snackBar = inject(MatSnackBar);
  private snackConfig = inject(SnackConfig);
  private destroy$ = new Subject<void>();

  startDate: string = '';
  endDate: string = '';

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportPeriod() {
    this.reportService.generateRevenueByPeriodPDF(this.startDate, this.endDate).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.snackBar.open('Relatório gerado com sucesso!', 'Fechar', this.snackConfig.default),
      error: (err: any) => this.snackBar.open(err?.message || 'Erro ao gerar relatório', 'Fechar', this.snackConfig.error),
    });
  }

  exportCategory() {
    this.reportService.generateRevenueByCategoryPDF().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.snackBar.open('Relatório gerado com sucesso!', 'Fechar', this.snackConfig.default),
      error: (err: any) => this.snackBar.open(err?.message || 'Erro ao gerar relatório', 'Fechar', this.snackConfig.error),
    });
  }
}
