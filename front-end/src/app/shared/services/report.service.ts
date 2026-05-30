import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  generateRevenueByPeriodPDF(startDate?: string, endDate?: string): Observable<void> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/revenue-by-period/pdf`, {
      params,
      responseType: 'blob',
      observe: 'response',
    }).pipe(
      map((response) => {
        const fallbackName = this.buildPeriodFallbackFileName(startDate, endDate);
        const fileName = this.extractFileName(response.headers.get('content-disposition')) || fallbackName;
        this.downloadBlob(response.body as Blob, fileName);
      }),
      catchError(this.mapHttpError),
    );
  }

  generateRevenueByCategoryPDF(): Observable<void> {
    return this.http.get(`${this.apiUrl}/revenue-by-category/pdf`, {
      responseType: 'blob',
      observe: 'response',
    }).pipe(
      map((response) => {
        const fileName = this.extractFileName(response.headers.get('content-disposition')) || 'receitas_por_categoria.pdf';
        this.downloadBlob(response.body as Blob, fileName);
      }),
      catchError(this.mapHttpError),
    );
  }

  private buildPeriodFallbackFileName(startDate?: string, endDate?: string): string {
    if (!startDate && !endDate) {
      return 'receitas_todos.pdf';
    }
    return `receitas_${startDate || 'inicio'}_ate_${endDate || 'fim'}.pdf`;
  }

  private extractFileName(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      return null;
    }
    const match = /filename=\"?([^\";]+)\"?/i.exec(contentDisposition);
    return match?.[1] ?? null;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  private mapHttpError(error: HttpErrorResponse) {
    const message = error.error?.message || error.error?.error || error.message || 'Erro ao gerar relatório PDF.';
    return throwError(() => new Error(message));
  }
}
