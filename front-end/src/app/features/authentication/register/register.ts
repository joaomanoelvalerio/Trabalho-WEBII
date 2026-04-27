import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { Address } from '../../../shared/models/address.model';
import { ViaCepService } from '../../../shared/services/via-cep.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly viaCepService = inject(ViaCepService);
  private readonly authService = inject(AuthService);

  currentStep = 1;

  user: Omit<User, 'id' | 'role'> = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    address: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  };

  confirmPassword = '';
  isAddressLoading = false;
  errorMessage: string | null = null;

  nextStep() {
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não conferem.';
      return;
    }
    this.errorMessage = null;
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  formatZipCode(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    input.value = value;
    this.user.address.zipCode = value;

    if (value.length === 9) {
      this.onZipCodeBlur();
    }
  }

  formatCpf(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '.$2');
    }

    input.value = value;
    this.user.cpf = value;
  }

  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length === 0) {
      input.value = '';
      this.user.phone = '';
      return;
    }

    if (value.length <= 2) {
      value = value.replace(/^(\d{1,2})/, '(');
    } else if (value.length <= 6) {
      value = value.replace(/^(\d{2})(\d{1,4})/, '() $2');
    } else if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{1,4})/, '() $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{1,4})/, '() $2-$3');
    }

    input.value = value;
    this.user.phone = value;
  }

  onZipCodeBlur() {
    const zipCode = this.user.address.zipCode.replace(/\D/g, '');

    if (!zipCode || zipCode.length !== 8) {
      this.isAddressLoading = false;
      return;
    }

    this.isAddressLoading = true;
    this.errorMessage = null;
    this.viaCepService.buscarCep(zipCode).subscribe({
      next: (address: Address) => {
        this.user.address.street       = address.street;
        this.user.address.neighborhood = address.neighborhood;
        this.user.address.city         = address.city;
        this.user.address.state        = address.state;
        this.isAddressLoading = false;
      },
      error: () => {
        this.errorMessage = 'CEP não encontrado ou inválido.';
        this.isAddressLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não conferem.';
      this.currentStep = 1;
      return;
    }

    this.errorMessage = null;
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Faça o login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}