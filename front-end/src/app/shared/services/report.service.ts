import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage';
import { RequestStatus } from '../models/solicitation.model';
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

    filtered = filtered.filter(r => {
      const refDate = r.paidAt || r.finalizedAt;
      return !!refDate;
    });

    if (startDate) {
      filtered = filtered.filter(r => {
        const refDate = (r.paidAt || r.finalizedAt)!;
        return refDate >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter(r => {
        const refDate = (r.paidAt || r.finalizedAt)!;
        return refDate <= (endDate + 'T23:59:59');
      });
    }

    const grouped: { [key: string]: number } = {};
    filtered.forEach(r => {
      const day = (r.paidAt || r.finalizedAt)!.split('T')[0];
      grouped[day] = (grouped[day] || 0) + (r.quoteValue || 0);
    });

    const tableData = Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => [
        new Date(date + 'T12:00:00').toLocaleDateString('pt-BR'),
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ]);

    const doc = new jsPDF();

    const titulo = 'Relatório de Receitas por Período';
    const periodo = startDate || endDate
      ? `Período: ${startDate ? new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'início'} até ${endDate ? new Date(endDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'hoje'}`
      : 'Período: todos os registros';

    const totalGeral = filtered.reduce((sum, r) => sum + (r.quoteValue || 0), 0);

    doc.setFontSize(14);
    doc.text(titulo, 14, 15);
    doc.setFontSize(10);
    doc.text(periodo, 14, 22);

    autoTable(doc, {
      head: [['Data', 'Receita Total']],
      body: tableData.length > 0 ? tableData : [['Nenhum registro encontrado', '']],
      startY: 28,
      foot: tableData.length > 0
        ? [['Total Geral', totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })]]
        : undefined,
    });

    const label = startDate || endDate
      ? `receitas_${startDate || 'inicio'}_ate_${endDate || 'fim'}`
      : 'receitas_todos';
    doc.save(`${label}.pdf`);
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

    const tableData = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, total]) => [
        cat,
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ]);

    const totalGeral = filtered.reduce((sum, r) => sum + (r.quoteValue || 0), 0);

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Relatório de Receitas por Categoria', 14, 15);
    doc.setFontSize(10);
    doc.text('Acumulado histórico de todas as solicitações pagas/finalizadas', 14, 22);

    autoTable(doc, {
      head: [['Categoria', 'Receita Total']],
      body: tableData.length > 0 ? tableData : [['Nenhum registro encontrado', '']],
      startY: 28,
      foot: tableData.length > 0
        ? [['Total Geral', totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })]]
        : undefined,
    });

    doc.save('receitas_por_categoria.pdf');
  }
}