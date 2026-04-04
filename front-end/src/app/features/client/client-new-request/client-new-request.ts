import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage';
import { AuthService } from '../../authentication/services/auth.service';
import { Category } from '../../../shared/models/category.model';
import { RequestStatus } from '../../../shared/models/solicitation.model';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-client-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest implements OnInit {
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);
  private readonly categoryService = inject(CategoryService);

  categories: Category[] = [];

  newRequest = {
    equipmentDescription: '',
    category: null as Category | null,
    defectDescription: '',
  };

  ngOnInit(): void {
    this.categories = this.categoryService.getAll();
  }

  countWords(text: string): number {
    if (!text?.trim()) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }
  onSubmit(): void {
    const user = this.authService.getLoggedInUser();
    if (!user) return;

    const dataAtual = new Date().toISOString();

    this.storageService.saveRequest({
      clientId: user.id,
      clientName: user.name,
      openedAt: dataAtual,
      equipmentDescription: this.newRequest.equipmentDescription.trim(),
      defectDescription: this.newRequest.defectDescription.trim(),
      status: RequestStatus.OPEN,
      history: [
        {
          date: dataAtual,
          description: 'Solicitação aberta pelo cliente.',
          userName: user.name,
        },
      ],
    });

    alert('Solicitação enviada com sucesso!');
    this.router.navigate(['/client']);
  }
  onCancel(): void {
    this.router.navigate(['/client']);
  }
}
