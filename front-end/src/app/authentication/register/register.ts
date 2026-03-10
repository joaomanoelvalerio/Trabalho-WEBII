import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { MudaPagina } from '../../services/muda-pagina';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  MudaPagina = inject(MudaPagina)

  usuario = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    cep: ''
    /* Posteriormente validar o cep no front usando a API ViaCEP e 
    completar campos como cidade, bairro e etc. */
  }

  onSubmit() {
  console.log('Dados enviados:', this.usuario);
  // Falta integrar com a API aqui ! ! !
  }  

  click(event: MouseEvent) {
  this.MudaPagina.mudarPagina(event, '/login');
  }
}
