import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ClinicaService } from '../../../../../../POV administrador/views/consultas-adm/services/clinica.service';  // Importe o serviço de clinica
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule], // Importar o HttpClientModule aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService] // Adicione o AuthService como provider, caso ainda não esteja
})
export class LoginComponent {
  cpf = '';
  senha = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private clinicaService: ClinicaService  // Injete o serviço de clinica
  ) {}

  onLogin() {
    console.log('Tentando logar com CPF:', this.cpf);  // Adicione um log
    this.authService.login(this.cpf, this.senha).subscribe(success => {
      if (success) {
        console.log('Login bem-sucedido!');

        // Obtenha a consulta agendada do paciente
        this.authService.getLoggedInCpf();  // Recupere o CPF do paciente logado
        this.fetchConsultaAgendada();  // Chame a função que busca a consulta agendada
        
        this.router.navigate(['/agendar']);
      } else {
        alert('CPF ou senha incorretos');
      }
    });
  }

  // Função que busca a consulta agendada do paciente
  fetchConsultaAgendada() {
    const cpfPaciente = this.authService.getLoggedInCpf();  // Recupere o CPF logado
    if (cpfPaciente) {  // Verifica se o CPF não é nulo
      // Busque a consulta agendada
      this.clinicaService.getConsultaAgendada(cpfPaciente).subscribe(consulta => {
        if (consulta && consulta.length > 0) {  // Verifica se a consulta foi encontrada
          // Armazenar a consulta agendada no sessionStorage
          sessionStorage.setItem('consultaAgendada', JSON.stringify(consulta[0]));  // Armazena a primeira consulta agendada (caso haja mais de uma)
  
          // Armazenar o nome da clínica também, baseado no ID da clínica
          const clinicaId = consulta[0].id_clinica;  // Pegue o id da clínica da consulta
          this.clinicaService.getClinicaNomeById(clinicaId).subscribe(nomeClinica => {
            sessionStorage.setItem('nomeClinica', nomeClinica);  // Armazena o nome da clínica
          });
        }
      });
    }
  }  
}
