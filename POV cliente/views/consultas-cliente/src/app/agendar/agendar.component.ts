import { Component, inject, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Pessoa } from '../../../../../../database/Models/Pessoa';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
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
  usuario!: Pessoa;
  editar: boolean = false;
  user = {
    nome: '',
    cpf: '',
    cidade: '',
    telefone: '',
    senha: '',
    img: '',
    confirmaSenha: '', // Novo campo para confirmar a senha
    dataNasc: '',
    sexo: '',
    genero: '',
    orientacao_sexual: '',
    raca_cor: '',
    nome_mae: '',
    nome_pai: '',
    bairro: '',
    estado: '',
    logadouro: '',
    numero: 0
  };
  formSubmitted = false;
  fileUrl: string | null = null; //iniciando o file vazio
  selectedFile: File | null = null; // Armazena o arquivo selecionado
  private readonly pessoaSevice = inject(PessoaService);

  constructor(
    private authService: AuthService,
    private pessoaService: PessoaService,
    private consultaService: ConsultaService,
    private clinicaService: ClinicaService,
    private router: Router,
    private notificationService: NotificationService,
    private location: Location,
    private http: HttpClient
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
      if (cpf) {
        this.pessoaSevice.getPessoas().subscribe(dado => {
          for (const pessoa of dado) {
            if (cpf == pessoa.id) {
              this.usuario = pessoa;
            }
          }
        });
      }
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
    const now = new Date(); // Data e hora atuais
    for (const consulta of this.consultas) {
      if (cpf === consulta.cpf_paciente) {
        const dataConsulta = new Date(consulta.data_consulta); // Converte a string em objeto Date
        // Verifica se a data da consulta é anterior ao momento atual
        if (dataConsulta > now) {
          return consulta;
        }
      }
    }
    return null; // Retorna null se nenhuma consulta válida for encontrada
  }

  // Método para desmarcar a consulta
  desmarcarConsulta(consulta: Consulta): void {
    const clinica = this.buscarClinica(consulta.id_clinica)?.nome || "desconhecida";
    const tipo = this.consultaAgendada?.tipo_consulta;

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
    const tipo = this.consultaAgendada?.tipo_consulta;

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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input?.files?.[0] || null;
  }

  editarAparece() {
    this.user = {
      nome: this.usuario.nome,
      cpf: this.usuario.id,
      cidade: this.usuario.cidade,
      telefone: this.usuario.celular,
      senha: this.usuario.senha,
      img: this.usuario.img,
      confirmaSenha: this.usuario.senha, // Novo campo para confirmar a senha
      dataNasc: this.usuario.dataNasc,
      sexo: this.usuario.sexo,
      genero: this.usuario.genero,
      orientacao_sexual: this.usuario.orientacao_sexual,
      raca_cor: this.usuario.raca_cor,
      nome_mae: this.usuario.nome_mae,
      nome_pai: this.usuario.nome_pai,
      bairro: this.usuario.bairro,
      estado: this.usuario.estado,
      logadouro: this.usuario.logradouro,
      numero: (this.usuario.numero)
    };

    this.editar = true;
  }

  onRegister() {
    this.formSubmitted = true;
    console.log(this.user);

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.user.bairro || !this.user.cidade || !this.user.confirmaSenha || !this.user.cpf || !this.user.dataNasc
      || !this.user.estado || !this.user.genero || !this.user.logadouro || !this.user.nome || !this.user.numero
      || !this.user.orientacao_sexual || !this.user.raca_cor || !this.user.senha || !this.user.sexo
      || !this.user.telefone
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Verifica se a senha e a confirmação da senha são iguais
    if (this.user.senha !== this.user.confirmaSenha) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }

    if (!this.selectedFile) {
      this.usuario = {
        id: this.user.cpf, // CPF
        senha: this.user.senha,
        nome: this.user.nome,
        sexo: this.user.sexo,
        dataNasc: this.user.dataNasc, // "YYYY-MM-DDTHH:MM:SS" para datas ISO
        raca_cor: this.user.raca_cor,
        celular: this.user.telefone,
        nome_mae: this.user.nome_mae,
        nome_pai: this.user.nome_pai,
        genero: this.user.genero,
        orientacao_sexual: this.user.orientacao_sexual,
        logradouro: this.user.logadouro,
        numero: this.user.numero,
        bairro: this.user.bairro,
        cidade: this.user.cidade,
        estado: this.user.estado,
        img: this.user.img
      };
      this.pessoaService.updatePessoa(this.usuario).subscribe();
      alert('Seus dados foram atualizados!');
      (window as any).location.reload();
    }
    else {
      const formData = new FormData();
      formData.append('file', this.selectedFile!);
      this.http.post<{ filePath: string }>('http://localhost:3001/upload', formData)
        .subscribe({
          next: (response) => {
            this.fileUrl = `http://localhost:3001${response.filePath}`;
            this.user.img = this.fileUrl!;
            // Chama o serviço de cadastro
            this.usuario = {
              id: this.user.cpf, // CPF
              senha: this.user.senha,
              nome: this.user.nome,
              sexo: this.user.sexo,
              dataNasc: this.user.dataNasc, // "YYYY-MM-DDTHH:MM:SS" para datas ISO
              raca_cor: this.user.raca_cor,
              celular: this.user.telefone,
              nome_mae: this.user.nome_mae,
              nome_pai: this.user.nome_pai,
              genero: this.user.genero,
              orientacao_sexual: this.user.orientacao_sexual,
              logradouro: this.user.logadouro,
              numero: this.user.numero,
              bairro: this.user.bairro,
              cidade: this.user.cidade,
              estado: this.user.estado,
              img: this.user.img
            };
            this.pessoaService.updatePessoa(this.usuario).subscribe();
            alert('Seus dados foram atualizados!');
            (window as any).location.reload();
          }
        });


    }


  }
}
