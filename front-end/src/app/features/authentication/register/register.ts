import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';
import { Address } from '../../../shared/models/address.model';
import { ViaCepService } from '../../../shared/services/via-cep.service';
import { UserService } from '../../../shared/services/user.service';
import { SnackConfig } from '../../../shared/services/snack-config';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly viaCepService = inject(ViaCepService);
  private readonly userService = inject(UserService);
  private readonly snackConfig = inject(SnackConfig);
  private readonly destroy$ = new Subject<void>();

  currentStep = 1;

  user: Omit<User, 'id' | 'role' | 'password'> = {
    name: '',
    email: '',
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

  isAddressLoading = false;
  errorMessage: string | null = null;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextStep() {
    this.errorMessage = null;
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  formatZipCode(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.substring(0, 8);
    if (value.length > 5) value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
    input.value = value;
    this.user.address.zipCode = value;
    if (value.length === 9) this.onZipCodeBlur();
  }

  onCpfChange(value: string) {
    this.user.cpf = this.formatCpfValue(value);
  }

  formatCpfValue(value: string): string {
    let clean = value.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.substring(0, 11);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return clean.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    if (clean.length <= 9) return clean.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }

  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length === 0) { input.value = ''; this.user.phone = ''; return; }
    if (value.length <= 2)       value = value.replace(/^(\d{1,2})/, '($1');
    else if (value.length <= 6)  value = value.replace(/^(\d{2})(\d{1,4})/, '($1) $2');
    else if (value.length <= 10) value = value.replace(/^(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    else                         value = value.replace(/^(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    input.value = value;
    this.user.phone = value;
  }

  onZipCodeBlur() {
    const zipCode = this.user.address.zipCode.replace(/\D/g, '');
    if (!zipCode || zipCode.length !== 8) { this.isAddressLoading = false; return; }
    this.isAddressLoading = true;
    this.errorMessage = null;
    this.viaCepService.buscarCep(zipCode).pipe(takeUntil(this.destroy$)).subscribe({
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
    this.errorMessage = null;
    this.userService.register(this.user).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        alert('Cadastro realizado com sucesso!\n\nVerifique sua caixa de entrada para pegar sua senha de acesso.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Erro da API:", err);
        this.errorMessage = err.error?.message || 'Erro ao realizar o cadastro. Verifique os dados.';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}