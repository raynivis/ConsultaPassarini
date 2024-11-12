import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConsultaService } from '../../../../services/consulta.service';
import { Consulta } from '../../../../../../../database/Models/Consulta';
import { ClinicaService } from '../../../../services/clinica.service';
import { PessoaService } from '../../../../services/pessoa.service';
import { Clinica } from '../../../../../../../database/Models/Clinica';
import { Pessoa } from '../../../../../../../database/Models/Pessoa';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-edita-vg',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './edita-vg.component.html',
  styleUrl: './edita-vg.component.css'
})
export class EditaVgComponent implements OnInit{
  fileUrl: string | null = null; //link do arquivo q vai ser enviado pro json server
  id!: string; //id da clinica passada por GET
  //lista dos objetos
  consultas: Consulta[] = [];
  pacientes: Pessoa[] = [];
  clinicas: Clinica[] = [];
  consultasId: Consulta[] = [];
  consultasFiltradas: Consulta[] = []; // Lista filtrada com base na pesquisa
  data: string = ''; //string do filtro

  //chamando o back de arquivos e dados
  constructor(private http: HttpClient, private route: ActivatedRoute, private consutaService: ConsultaService, private pessoaService: PessoaService, private clinicaService: ClinicaService) {
  }

  ngOnInit() { //recebendo os dados na lista ao iniciar 
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
      this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; }); 
      //invertendo a lista para o mais recente primeiro, e filtrando para as consultas da clinica id
      this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado.reverse(); this.clinicasConsultas(); });
    });
  }

  clinicasConsultas() {
    for(const consulta of this.consultas) {
      if(consulta.id_clinica == this.id){
        this.consultasId.push(consulta);
      }   
    }
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

  //filtrar a consulta na busca
  filtrarConsultas(): void {
    // Verifica se há uma data selecionada no input
    const dataFiltro = this.data ? new Date(this.data) : null;
  
    this.consultasFiltradas = this.consultas
      .filter((consulta) => {
        // Obtém a data da consulta e a formata para comparação
        const dataConsulta = new Date(consulta.data_consulta); // Supondo que `consulta.data` seja uma string ou Date
        
        // Formata ambas as datas para o formato 'YYYY-MM-DD' para comparação
        const dataConsultaStr = dataConsulta.toISOString().split('T')[0];
        const dataFiltroStr = dataFiltro ? dataFiltro.toISOString().split('T')[0] : '';
  
        // Retorna verdadeiro se a data da consulta for igual à data do filtro
        return dataFiltro && dataConsultaStr === dataFiltroStr;
      });
  }

  // back end do arquivo dos relatorios
  onFileSelected(event: Event, consulta: Consulta) {
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
}
