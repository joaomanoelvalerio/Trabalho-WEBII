import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../../shared/models/usuario.model';
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
  private router = inject(Router);
  private viaCepService = inject(ViaCepService);
  private authService = inject(AuthService);

  usuario: Omit<Usuario, 'id' | 'perfil' | 'senha'> = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: {
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

  onCepBlur() {
    const cep = this.usuario.endereco.zipCode;
    if (cep && cep.length >= 8) {
      this.isAddressLoading = true;
      this.errorMessage = null;
      this.viaCepService.buscarCep(cep).subscribe({
        next: (endereco: Address) => {
          this.usuario.endereco.street = endereco.street;
          this.usuario.endereco.neighborhood = endereco.neighborhood;
          this.usuario.endereco.city = endereco.city;
          this.usuario.endereco.state = endereco.state;
          this.isAddressLoading = false;
        },
        error: () => {
          this.errorMessage = 'CEP não encontrado ou inválido.';
          this.isAddressLoading = false;
        },
      });
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.authService.register(this.usuario).subscribe({
      next: (response) => {
        alert(
          `Cadastro realizado com sucesso!\nSua senha temporária é: ${response.senhaTemporaria}\nAnote sua senha e faça o login.`
        );
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