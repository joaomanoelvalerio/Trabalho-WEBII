import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  usuario = {
    email: '',
    senha: '',
  };

  errorMessage: string | null = null;

  onSubmit() {
    this.errorMessage = null;
    this.authService.login(this.usuario.email, this.usuario.senha).subscribe({
      next: (response) => {
        const perfil = response.user.perfil;
        if (perfil === 'cliente') {
          this.router.navigate(['/client-home']);
        } else if (perfil === 'funcionario' || perfil === 'admin') {
          this.router.navigate(['/funcionario']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}