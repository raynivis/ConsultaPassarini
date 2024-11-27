import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../../../../POV administrador/views/consultas-adm/services/pessoa.service';
import { ClinicaService } from '../../../../../../POV administrador/views/consultas-adm/services/clinica.service';
import { ConsultaService } from '../../../../../../POV administrador/views/consultas-adm/services/consulta.service';
import { NotificationService } from './notification.service';
import { Clinica } from '../../../../../../database/Models/Clinica';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [HeaderComponent, CommonModule,],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css'],
})
export class AgendarComponent implements OnInit {
  nomePaciente: string | null = '';
  showConfirmModal: boolean = false;
  clinicas: Clinica[] = [];
  cpf = '';
  consultas: Consulta[] = [];
  consultaAgendada: Consulta | null = null; // Consulta do paciente
  consultaDesmarcar: Consulta | null = null;

  constructor(
    private authService: AuthService,
    private pessoaService: PessoaService,
    private consultaService: ConsultaService,
    private clinicaService: ClinicaService,
    private router: Router,
    private notificationService: NotificationService,
    private location: Location
  ) { }

  reloadPage(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consultaService.getConsultas().subscribe(dado => { this.consultas = dado; });
    this.consultaAgendada = null;  // Limpa a consulta antes de buscar novas informações

    const cpf = this.authService.getLoggedInCpf();
    if (cpf) {
      this.pessoaService.getNome(cpf).subscribe({
        next: (nome) => {
          this.nomePaciente = nome;
          this.cpf = cpf;
          this.consultaAgendada = this.buscarConsulta(cpf);
        },
        error: (err) => {
          console.error('Erro ao buscar o nome do paciente:', err);
          this.notificationService.notify('Erro ao carregar informações do paciente.');
        },
      });
    } else {
      alert('Você não está logado! Faça login ou cadastre-se para poder agendar e visualizar suas consultas!');
      this.router.navigate(['/login']);
    }
  }

  // Função para buscar a clínica pelo ID
  buscarClinica(idClinica: string): Clinica | null {
    for (const clinica of this.clinicas) {
      if (idClinica === clinica.id) {  // Corrigido para comparação correta (===)
        return clinica;
      }
    }
    return null;
  }

  buscarClinicaCpf(): Clinica | null {
    const id_clinica = this.consultaAgendada?.id_clinica
    for (const clinica of this.clinicas) {
      if (id_clinica === clinica.id) {
        return clinica;
      }
    }
    return null;
  }

  // Função para buscar a consulta pelo CPF
  buscarConsulta(cpf: string): Consulta | null {
    for (const consulta of this.consultas) {
      if (cpf === consulta.cpf_paciente) {  // Corrigido para comparação correta (===)
        return consulta;
      }
    }
    return null;
  }

  // Método para desmarcar a consulta
  desmarcarConsulta(consulta: Consulta): void {
    const clinica = this.buscarClinica(consulta.id_clinica)?.nome || "desconhecida";
    const tipo =  this.consultaAgendada?.tipo_consulta;

    // Exibe o diálogo de confirmação com opções OK e Cancel
    const confirmacao = confirm(
      `Você está prestes a DESMARCAR uma consulta para "${tipo}" na clínica "${clinica}". Deseja continuar?`
    );

    if (confirmacao) {

      if (this.cpf) {
        consulta.cpf_paciente = '';  // Atribui o CPF do paciente à consulta

        // Chama o método do consultaService para agendar
        this.consultaService.updateConsulta(consulta).subscribe({
          next: (consultaAgendada) => {
            this.consultaAgendada = consultaAgendada;
            this.notificationService.notify('Consulta desmarcada com sucesso!');
            console.log('Consulta desmarcada:', consultaAgendada);
            this.reloadPage();
          },
          error: (err) => {
            console.error('Erro ao agendar consulta:', err);
            this.notificationService.notify('Erro ao agendar consulta.');
          }
        });
      } else {
        this.notificationService.notify('Erro: CPF do paciente não encontrado.');
      }
    }
  }


  // Método para agendar consulta
  agendarConsulta(consulta: Consulta): void {
    const clinica = this.buscarClinica(consulta.id_clinica)?.nome || "desconhecida";
    const tipo =  this.consultaAgendada?.tipo_consulta;

    // Exibe o diálogo de confirmação com opções OK e Cancel
    const confirmacao = confirm(
      `Você está prestes a AGENDAR uma consulta para "${tipo}" na clínica "${clinica}". Deseja continuar?`
    );

    if (confirmacao) {

      if (this.cpf) {
        consulta.cpf_paciente = this.cpf;  // Atribui o CPF do paciente à consulta

        // Chama o método do consultaService para agendar
        this.consultaService.updateConsulta(consulta).subscribe({
          next: (consultaAgendada) => {
            this.consultaAgendada = consultaAgendada;
            this.notificationService.notify('Consulta agendada com sucesso!');
            console.log('Consulta agendada:', consultaAgendada);
          },
          error: (err) => {
            console.error('Erro ao agendar consulta:', err);
            this.notificationService.notify('Erro ao agendar consulta.');
          }
        });
      } else {
        this.notificationService.notify('Erro: CPF do paciente não encontrado.');
      }
    }
  }


  logout(): void {
    this.authService.logout();
    this.notificationService.notify('Paciente saiu da conta, redirecionando para a página inicial...');
    this.nomePaciente = null;      // Limpa o nome do paciente
    this.cpf = '';                 // Limpa o CPF
    this.consultaAgendada = null;  // Limpa a consulta agendada
    this.consultas = [];           // Limpa a lista de consultas
    this.router.navigate(['/home']);
  }
}
