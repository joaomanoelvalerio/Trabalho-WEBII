import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  credentials = {
    email: '',
    password: '',
  };

  errorMessage: string | null = null;

  onSubmit() {
    this.errorMessage = null;
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        const role = response.user.role;
        if (role === 'CLIENT') {
          this.router.navigate(['/client']);
        } else if (role === 'EMPLOYEE' || role === 'ADMIN') {
          this.router.navigate(['/employee']);
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