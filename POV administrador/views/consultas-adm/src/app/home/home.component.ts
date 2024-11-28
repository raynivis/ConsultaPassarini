import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../services/pessoa.service'
import { ClinicaService } from '../../../services/clinica.service';
import { ConsultaService } from '../../../services/consulta.service';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { Pessoa } from '../../../../../../database/Models/Pessoa';
import { Clinica } from '../../../../../../database/Models/Clinica';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('ModalPaciente') modalElement!: ElementRef;
  fileUrl: string | null = null; //iniciando o file vazio
  consultas: Consulta[] = []; //lista de consultas
  pacientes: Pessoa[] = []; //lista de pessoas
  clinicas: Clinica[] = []; // lista de clinicas
  consultaDia: number = 0; //variavel para consultas do dia
  relatoriosFaltantes: number = 0; //variavel para relatorios pendentes
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
  idfile!: string;

  constructor(private http: HttpClient, private pessoaService: PessoaService, private clinicaService: ClinicaService,
    private consutaService: ConsultaService) { } //chamando a parte do back-end pro front

  ngOnInit(): void { //Ao ser iniciado, o service armazena a lista de dados nas variaveis de lista
    this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consutaService.getConsultas().subscribe(dado => {
      this.consultas = dado.reverse(); //invertendo a lista para deixar o mais recente primeiro
      this.consultasDia(); //calculo das consultas do dia
      this.relatorioSemAnexos(); //contando os relatorios sem anexo
    });

  }

  consultasDia(): void {
    const today = new Date().toISOString().split('T')[0]; // Obtém a data de hoje no formato 'YYYY-MM-DD'
    console.log(today);
    this.consultaDia = 0; // Reinicia o contador

    for (const consulta of this.consultas) {
      const dataConsulta = new Date(consulta.data_consulta).toISOString().split('T')[0];
      if (dataConsulta === today) {
        console.log(consulta.data_consulta);
        this.consultaDia++;
      }
    }
  }

  relatorioSemAnexos(): void {
    this.relatoriosFaltantes = 0; // Reinicia o contador
    for (const consulta of this.consultas) {
      if (consulta.cpf_paciente && !consulta.relatorio) {
        this.relatoriosFaltantes++;
      }
    }
  }

  buscarPaciente(cpf: string): Pessoa | null { //buscar o cliente para pegar o Nome e no uso do Modal
    for (const pessoa of this.pacientes) {
      if (cpf == pessoa.id) {
        return pessoa;
      }
    }
    return null;
  }

  buscarClinica(idclinica: string): Clinica | null { //buscar a Clinica para achar o Nome
    for (const clinica of this.clinicas) {
      if (idclinica == clinica.id) {
        return clinica;
      }
    }
    return null;
  }

  buscarConsulta(id: string): Consulta | null { //buscar a Clinica para achar o Nome
    for (const consulta of this.consultas) {
      if (id == consulta.id) {
        return consulta;
      }
    }
    return null;
  }

  oi(id: string){
    this.idfile = id;
  }


  //Back-End de Arquivos (Tive que colocar aqui pq não entendi no Service)
  onFileSelected(event: Event) {
    var consulta = this.buscarConsulta(this.idfile);
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

          consulta!.relatorio = this.fileUrl!;
          this.consutaService.updateConsulta(consulta!).subscribe();
          location.reload();
        },
        error: (error) => {
          console.error('Erro ao fazer upload:', error);
        }
      });

  }

  //Aparecer o Modal na tela ao clicar, reecebe pessoa, pq pessoa vai ser atribuida aos campos
  openModal(paciente: Pessoa) {
    if (this.modalElement) {
      this.pacienteModel = paciente;
      const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
      modal.show();
    } else {
      console.error('Modal element não encontrado');
    }
  }
}
