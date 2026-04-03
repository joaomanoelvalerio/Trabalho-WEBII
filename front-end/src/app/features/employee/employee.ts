import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule }   from '@angular/material/table';
import { MatButtonModule }  from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog';
import { RequestStatus, Solicitation } from '../../shared/models/solicitation.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../shared/services/storage';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
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
    const all = this.storageService.getRequests();
    this.requests = all.filter(req => req.status === RequestStatus.OPEN);
  }

  getShortDescription(desc: string): string {
    return desc?.length > 30 ? desc.substring(0, 27) + '...' : desc;
  }

  onSubmitQuote(request: Solicitation): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, { width: '480px', data: { request } });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.storageService.updateRequestStatus(request.id, RequestStatus.QUOTED);
        this.snackBar.open('Orçamento salvo!', 'OK', { duration: 3000 });
        this.loadRequests();
      }
    });
  }
}