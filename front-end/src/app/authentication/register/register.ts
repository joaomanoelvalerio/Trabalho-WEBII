import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { Endereco } from '../../models/endereco.model';
import { ViaCepService } from '../../services/via-cep.service';
import { AuthService } from '../../services/auth.service';

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
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
  };

  isAddressLoading = false;
  errorMessage: string | null = null;

  onCepBlur() {
    const cep = this.usuario.endereco.cep;
    if (cep && cep.length >= 8) {
      this.isAddressLoading = true;
      this.errorMessage = null;
      this.viaCepService.buscarCep(cep).subscribe({
        next: (endereco: Endereco) => {
          this.usuario.endereco.logradouro = endereco.logradouro;
          this.usuario.endereco.bairro = endereco.bairro;
          this.usuario.endereco.cidade = endereco.cidade;
          this.usuario.endereco.estado = endereco.estado;
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
