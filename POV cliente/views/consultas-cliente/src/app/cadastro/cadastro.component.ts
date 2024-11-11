import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  providers: [AuthService]
})
export class CadastroComponent {
  user = {
    nome: '',
    sobrenome: '',
    cpf: '',
    cidade: '',
    telefone: '',
    senha: '',
    confirmarSenha: '' // Novo campo para confirmar a senha
  };
  formSubmitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.formSubmitted = true;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.user.nome || !this.user.sobrenome || !this.user.cpf || !this.user.telefone || !this.user.senha || !this.user.confirmarSenha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Verifica se a senha e a confirmação da senha são iguais
    if (this.user.senha !== this.user.confirmarSenha) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }

    // Chama o serviço de cadastro
    this.authService.register(this.user).subscribe(
      () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      (error) => {
        alert(error.message || 'Erro ao cadastrar');
      }
    );
  }
}
