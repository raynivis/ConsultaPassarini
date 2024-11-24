import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../../../../POV administrador/views/consultas-adm/services/pessoa.service';
import { ClinicaService } from '../../../../../../POV administrador/views/consultas-adm/services/clinica.service';
import { ConsultaService } from '../../../../../../POV administrador/views/consultas-adm/services/consulta.service'; // Importando o serviço de consultas
import { NotificationService } from './notification.service'; // Serviço de notificações
import { Clinica } from '../../../../../../database/Models/Clinica';
import { Consulta } from '../../../../../../database/Models/Consulta'; // Importando o modelo Consulta

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css'],
})
export class AgendarComponent implements OnInit {
  nomePaciente: string | null = '';
  consultaAgendada: Consulta | null = null;  // Armazena a consulta agendada
  consultasDisponiveis: Consulta[] = []; // Para armazenar as consultas com cpf nulo
  nomeClinica: string | null = '';
  showConfirmModal: boolean = false;  // Variável para controlar o modal de confirmação

  constructor(
    private authService: AuthService,
    private pessoaService: PessoaService,
    private consultaService: ConsultaService,
    private clinicaService: ClinicaService,
    private router: Router,
    private notificationService: NotificationService // Injeta o serviço de notificação
  ) {}

  ngOnInit(): void {
    const cpf = this.authService.getLoggedInCpf();
    if (cpf) {
      // Busca as informações do paciente
      this.pessoaService.getNome(cpf).subscribe({
        next: (nome) => this.nomePaciente = nome,
        error: (err) => {
          console.error('Erro ao buscar o nome do paciente:', err);
          this.notificationService.notify('Erro ao carregar informações do paciente.');
        },
      });

      // Busca a consulta agendada para o paciente logado
      this.consultaService.getConsultaPorCpf(cpf).subscribe({
        next: (consultas) => {
          this.consultaAgendada = consultas.find(consulta => consulta.cpf_paciente === cpf) || null; // Garante que consultaAgendada seja null se não encontrar
          
          if (this.consultaAgendada) {
            // Se o paciente tiver consulta agendada, busca o nome da clínica
            const clinicaId: string = this.consultaAgendada.id_clinica;
            this.clinicaService.getClinicaNomeById(Number(clinicaId)).subscribe({
              next: (nomeClinica) => {
                this.nomeClinica = nomeClinica;
              },
              error: (err) => {
                console.error('Erro ao buscar o nome da clínica:', err);
                this.notificationService.notify('Erro ao carregar nome da clínica.');
              }
            });
          } else {
            // Se o paciente não tiver consulta agendada, busca as consultas com CPF nulo
            this.consultaService.getConsultasSemCpf().subscribe({
              next: (consultas) => this.consultasDisponiveis = consultas,
              error: (err) => {
                console.error('Erro ao buscar consultas disponíveis:', err);
                this.notificationService.notify('Erro ao carregar consultas disponíveis.');
              }
            });
          }
        },
        error: (err) => {
          console.error('Erro ao buscar as consultas do paciente:', err);
          this.notificationService.notify('Erro ao carregar consultas.');
        },
      });
    } else {
      // Se o paciente não estiver logado, redireciona para login
      this.router.navigate(['/login']);
    }
  }

  confirmarDesmarcarConsulta(): void {
    this.showConfirmModal = true;  // Exibe o modal de confirmação
  }

  cancelarDesmarcarConsulta(): void {
    this.showConfirmModal = false;  // Fecha o modal de confirmação
  }

  desmarcarConsulta(): void {
    const cpfPaciente = this.authService.getLoggedInCpf();
    if (cpfPaciente && this.consultaAgendada) {
      // Passando o id da consulta para remover o CPF da consulta
      this.consultaService.removerCpfConsulta(this.consultaAgendada.id).subscribe({
        next: () => {
          alert('CPF removido da consulta com sucesso!');
          this.consultaAgendada = null;  // Remove a consulta da variável
          this.showConfirmModal = false;  // Fecha o modal de confirmação
          this.carregarConsultas();  // Recarrega as consultas disponíveis
        },
        error: (err: any) => {
          console.error('Erro ao remover o CPF da consulta:', err);
          alert('Erro ao remover o CPF da consulta.');
        }
      });
    }
  }

  agendarConsulta(consulta: Consulta): void {
    const cpfPaciente = this.authService.getLoggedInCpf();
    if (cpfPaciente) {
      // Atualiza a consulta para incluir o CPF do paciente
      consulta.cpf_paciente = cpfPaciente; // Adicionando o CPF do paciente à consulta

      this.consultaService.agendarConsulta(consulta).subscribe({
        next: () => {
          alert('Consulta agendada com sucesso!');
          this.carregarConsultas(); // Recarrega as consultas disponíveis após o agendamento
        },
        error: (err) => {
          console.error('Erro ao agendar consulta:', err);
          alert('Erro ao agendar a consulta.');
        }
      });
    }
  }

  carregarConsultas(): void {
    const cpfPaciente = this.authService.getLoggedInCpf();
    if (cpfPaciente) {
      this.consultaService.getConsultaPorCpf(cpfPaciente).subscribe({
        next: (consultas) => {
          this.consultaAgendada = consultas.find(consulta => consulta.cpf_paciente === cpfPaciente) || null;
          if (!this.consultaAgendada) {
            this.consultaService.getConsultasSemCpf().subscribe({
              next: (consultasDisponiveis) => {
                this.consultasDisponiveis = consultasDisponiveis;
              },
              error: (err) => {
                console.error('Erro ao carregar consultas disponíveis:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Erro ao carregar as consultas:', err);
        }
      });
    }
  }

  // Método de logout
  logout(): void {
    this.authService.logout();
    this.notificationService.notify('Paciente saiu da conta, redirecionando para a página inicial...');
    this.router.navigate(['/home']);
  }
}
