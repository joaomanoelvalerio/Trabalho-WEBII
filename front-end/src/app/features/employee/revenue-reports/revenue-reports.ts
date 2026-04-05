import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../shared/services/report.service';

@Component({
  selector: 'app-revenue-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revenue-reports.html'
})
export class RevenueReportsComponent {
  private reportService = inject(ReportService);

  startDate: string = '';
  endDate: string = '';

  exportPeriod() {
    this.reportService.generateRevenueByPeriodPDF(this.startDate, this.endDate);
  }

  exportCategory() {
    this.reportService.generateRevenueByCategoryPDF();
  }
}
