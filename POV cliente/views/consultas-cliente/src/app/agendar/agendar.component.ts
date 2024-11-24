import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../../../../POV administrador/views/consultas-adm/services/pessoa.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css'],
})
export class AgendarComponent implements OnInit {
  nomePaciente: string | null = ''; // Nome do paciente

  constructor(
    private authService: AuthService,
    private pessoaService: PessoaService, // Injeta o PessoaService
    private router: Router
  ) {}

  ngOnInit(): void {
    const cpf = this.authService.getLoggedInCpf(); // Obtém o CPF do usuário logado
    if (cpf) {
      // Busca o nome pelo CPF
      this.pessoaService.getNome(cpf).subscribe({
        next: (nome) => {
          this.nomePaciente = nome; // Atualiza o nome do paciente
        },
        error: (err) => {
          console.error('Erro ao buscar o nome do paciente:', err);
          this.nomePaciente = 'Paciente não encontrado'; // Mensagem em caso de erro
        },
      });
    } else {
      this.router.navigate(['/login']); // Redireciona para o login se o CPF não for encontrado
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']); // Redireciona para a página inicial
  }
}
