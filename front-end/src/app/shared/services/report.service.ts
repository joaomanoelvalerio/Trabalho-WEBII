import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage';
import { RequestStatus, Solicitation } from '../models/solicitation.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private storageService = inject(StorageService);

  generateRevenueByPeriodPDF(startDate?: string, endDate?: string) {
    const requests = this.storageService.getRequests();

    let filtered = requests.filter(r =>
      r.status === RequestStatus.PAID || r.status === RequestStatus.FINALIZED
    );

    if (startDate) filtered = filtered.filter(r => (r.paidAt || r.openedAt) >= startDate);
    if (endDate) filtered = filtered.filter(r => (r.paidAt || r.openedAt) <= (endDate + 'T23:59:59'));

    const grouped: { [key: string]: number } = {};
    filtered.forEach(r => {
      const day = (r.paidAt || r.openedAt).split('T')[0];
      grouped[day] = (grouped[day] || 0) + (r.quoteValue || 0);
    });

    const tableData = Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => [
        new Date(date + 'T12:00:00').toLocaleDateString('pt-BR'),
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ]);

    const doc = new jsPDF();
    doc.text('Relatório de Receitas por Período', 14, 15);
    autoTable(doc, {
      head: [['Data', 'Receita Total']],
      body: tableData,
      startY: 20
    });

    doc.save(`receitas_${startDate || 'inicio'}_ate_${endDate || 'fim'}.pdf`);
  }

  generateRevenueByCategoryPDF() {
    const requests = this.storageService.getRequests();
    const filtered = requests.filter(r =>
      r.status === RequestStatus.PAID || r.status === RequestStatus.FINALIZED
    );

    const grouped: { [key: string]: number } = {};
    filtered.forEach(r => {
      const cat = r.categoryName || 'Não Categorizado';
      grouped[cat] = (grouped[cat] || 0) + (r.quoteValue || 0);
    });

    const tableData = Object.entries(grouped).map(([cat, total]) => [
      cat,
      total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);

    const doc = new jsPDF();
    doc.text('Relatório de Receitas por Categoria', 14, 15);
    autoTable(doc, {
      head: [['Categoria', 'Receita Total']],
      body: tableData,
      startY: 20
    });

    doc.save('receitas_por_categoria.pdf');
  }
}
