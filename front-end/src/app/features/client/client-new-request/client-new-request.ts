import { Component, inject } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RequestStatus } from '../../../shared/models/solicitation.model'; 

@Component({
  selector: 'app-client-new-request',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-new-request.html',
  styleUrl: './client-new-request.css',
})
export class ClientNewRequest {
  private router = inject(Router);
  private storageService = inject(StorageService);
  
  categories: { id: number; name: string }[] = [
    { id: 1, name: 'Notebook' },
    { id: 2, name: 'Desktop' },
    { id: 3, name: 'Impressora' },
    { id: 4, name: 'Teclado' },
    { id: 5, name: 'Mouse' },
  ];

  newRequest = {
    equipmentDescription: '',
    category: null,
    defectDescription: '',
  };

  countWords(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  submitRequest(): void {
    if (this.countWords(this.newRequest.equipmentDescription) < 3 || 
        !this.newRequest.category || 
        this.countWords(this.newRequest.defectDescription) < 3) {
      return;
    }

    const finalSolicitation = {
      id: Math.floor(Math.random() * 10000),
      openedAt: new Date().toISOString(),   
      equipmentDescription: this.newRequest.equipmentDescription,
      status: RequestStatus.OPEN,          
      clientId: 1,                       
      
      category: this.newRequest.category,
      defectDescription: this.newRequest.defectDescription
    };

    console.log(finalSolicitation);
    this.storageService.saveRequest(finalSolicitation);

    alert('Solicitação enviada com sucesso!');
    this.router.navigate(['/client']);
  }

  goBack(): void {
    this.router.navigate(['/client']);
  }
}