import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  imports: [DatePipe, CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {

  requests = [
    {
      id: 1,
      dateTime: new Date(),
      clientName: 'João Silva',
      description: 'Notebook Dell não liga após queda',
    },
    {
      id: 2,
      dateTime: new Date(),
      clientName: 'Maria Souza',
      description: 'Celular Samsung com tela quebrada',
    },
  ];

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length <= 30
      ? description
      : description.substring(0, 30) + '...';
  }

  submitQuote(id: number) {
    console.log('Submit quote for request:', id);
  }
}