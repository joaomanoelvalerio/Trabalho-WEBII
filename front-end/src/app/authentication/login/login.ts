import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { MudaPagina } from '../../services/muda-pagina';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  MudaPagina = inject(MudaPagina);

  usuario = {
    email: '',
    senha: ''
  };

  onSubmit() {
    console.log('Dados enviados:', this.usuario);
    // Falta integrar com a API aqui ! ! !
  }  

click(event: MouseEvent) {
  this.MudaPagina.mudarPagina(event, '/register');
}
}