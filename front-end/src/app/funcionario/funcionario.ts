import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funcionario',
  imports: [DatePipe, CommonModule],
  templateUrl: './funcionario.html',
  styleUrl: './funcionario.css',
})
export class FuncionarioComponent {
  getDescricaoCurta(descricao: string): string {
    if (!descricao) return '';

    if (descricao.length <= 30) {
      return descricao;
    }

    return descricao.substring(0, 30) + '...';
  }

  solicitacoes = [
    {
      id: 1,
      dataHora: new Date(),
      cliente: 'João Silva',
      descricao: 'Notebook Dell não liga após queda',
    },
    {
      id: 2,
      dataHora: new Date(),
      cliente: 'Maria Souza',
      descricao: 'Celular Samsung com tela quebrada',
    },
  ];

  efetuarOrcamento(id: number) {
    console.log('Efetuar orçamento da solicitação:', id);
  }
}
