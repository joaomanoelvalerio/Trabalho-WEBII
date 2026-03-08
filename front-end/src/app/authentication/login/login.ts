import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = {
    email: '',
    senha: ''
  };

  onSubmit() {
    console.log('Dados enviados:', this.usuario);
    // Falta integrar com a API aqui ! ! !
  }
}