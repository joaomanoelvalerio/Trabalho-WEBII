import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface Solicitacao {
  id: number;
  dataHora: Date;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
})

export class ClienteHomeComponent implements OnInit {
  // Massa de dados inicial para teste conforme RF089/RF090
  solicitacoes: Solicitacao[] = [
    { id: 1, dataHora: new Date('2024-03-01T10:00:00'), descricao: 'Notebook Dell Inspiron - Tela Quebrada', estado: 'ABERTA' },
    { id: 2, dataHora: new Date('2024-03-02T14:30:00'), descricao: 'Impressora HP LaserJet - Papel Preso', estado: 'ORÇADA' },
    { id: 3, dataHora: new Date('2024-03-05T09:15:00'), descricao: 'Desktop Gamer - Limpeza Geral e Troca de Pasta Térmica', estado: 'REJEITADA' },
    { id: 4, dataHora: new Date('2024-03-07T16:00:00'), descricao: 'Monitor LG - Não liga após queda de energia', estado: 'ARRUMADA' },
  ];

  ngOnInit(): void {
    // RF003: Ordenadas de forma crescente por data/hora
    this.solicitacoes.sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());
  }

  getDescricaoCurta(desc: string): string {
    // RF003: Descrição limitada a 30 caracteres
    return desc.length > 30 ? desc.substring(0, 27) + '...' : desc; 
  }
}