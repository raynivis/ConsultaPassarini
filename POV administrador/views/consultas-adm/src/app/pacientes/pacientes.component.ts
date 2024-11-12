import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../services/pessoa.service'
import { ClinicaService } from '../../../services/clinica.service';
import { ConsultaService } from '../../../services/consulta.service';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { Pessoa } from '../../../../../../database/Models/Pessoa';
import { Clinica } from '../../../../../../database/Models/Clinica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  @ViewChild('ModalPaciente') modalElement!: ElementRef; //referencia para a div do Model
  fileUrl: string | null = null; //url do arquivo de relatiorio
  consultas: Consulta[] = []; //lista de consultas
  consultasFiltradas: Consulta[] = []; // Lista filtrada com base na pesquisa
  buscaNome: string = ''; //input das buscas de nome
  pacientes: Pessoa[] = []; //lista de pacientes
  clinicas: Clinica[] = []; //lista de clinicas
  pacienteModel: Pessoa = { //Criando uma Pessoa vazia para o Model De Paciente
    id: "",               // CPF vazio
    senha: "",            // Senha vazia
    nome: "",             // Nome vazio
    sexo: "",             // Sexo vazio
    dataNasc: "",         // Data de nascimento vazia
    raca_cor: "",         // Raça/Cor vazio
    celular: "",          // Celular vazio
    nome_mae: "",         // Nome da mãe vazio
    nome_pai: "",         // Nome do pai vazio
    genero: "",           // Gênero vazio
    orientacao_sexual: "",// Orientação sexual vazia
    logradouro: "",       // Logradouro vazio
    numero: 0,            // Número 0 (como padrão)
    bairro: "",           // Bairro vazio
    cidade: "",           // Cidade vazia
    estado: "",           // Estado vazio
    img: ""               // URL da imagem vazia
  };


  constructor(private http: HttpClient, private pessoaService: PessoaService, private clinicaService: ClinicaService,
    private consutaService: ConsultaService) { } //chamando o back-end

  ngOnInit(): void { //falei no Componentente Home o que faz
    this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado.reverse(); });
    this.filtrarConsultas(); //filtrando as pesquisas de consultas
  }

  buscarPaciente(cpf: string): Pessoa | null {
    for (const pessoa of this.pacientes) {
      if (cpf == pessoa.id) {
        return pessoa;
      }
    }
    return null;
  }

  buscarClinica(idclinica: string): Clinica | null {
    for (const clinica of this.clinicas) {
      if (idclinica == clinica.id) {
        return clinica;
      }
    }
    return null;
  }

  filtrarConsultas(): void { //filtrando a lista de consultas a partir da lista de consultas do DataBase
    this.consultasFiltradas = this.consultas
      .filter((consulta) =>
        this.buscarPaciente(consulta.cpf_paciente)?.nome
          .toLowerCase()
          .includes(this.buscaNome.toLowerCase())
      )
      .sort((a, b) => {
        const nomeA = this.buscarPaciente(a.cpf_paciente)?.nome.toLowerCase() || '';
        const nomeB = this.buscarPaciente(b.cpf_paciente)?.nome.toLowerCase() || '';
        return nomeA.localeCompare(nomeB);
      });
  }
  onFileSelected(event: Event, consulta: Consulta) { //Envio do Arquivo 
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      console.log('Nenhum arquivo selecionado');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ filePath: string }>('http://localhost:3001/upload', formData)
      .subscribe({
        next: (response) => {
          this.fileUrl = `http://localhost:3001${response.filePath}`;

          consulta.relatorio = this.fileUrl!;
          this.consutaService.updateConsulta(consulta).subscribe();
        },
        error: (error) => {
          console.error('Erro ao fazer upload:', error);
        }
      });
  }

  openModal(paciente: Pessoa) { //Aparecimento do Modal
    if (this.modalElement) {
      this.pacienteModel = paciente;
      const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
      modal.show();
    } else {
      console.error('Modal element não encontrado');
    }
  }

}
