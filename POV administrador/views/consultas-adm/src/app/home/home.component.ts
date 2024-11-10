import { Component, OnInit } from '@angular/core';
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
  fileUrl: string | null = null;
  consultas: Consulta[] = [];
  pacientes: Pessoa[] = [];
  clinicas: Clinica[] = [];
  consultaDia: number = 0;
  relatoriosFaltantes: number = 0;

  constructor(private http: HttpClient, private pessoaService: PessoaService, private clinicaService: ClinicaService,
    private consutaService: ConsultaService) { }

  ngOnInit(): void {
    this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consutaService.getConsultas().subscribe(dado => { 
      this.consultas = dado.reverse();
      this.consultasDia();
      this.relatorioSemAnexos();
    });

  }

  consultasDia(): void {
    const today = new Date().toISOString().split('T')[0]; // Obtém a data de hoje no formato 'YYYY-MM-DD'

    this.consultaDia = 0; // Reinicia o contador

    for (const consulta of this.consultas) {
      const dataConsulta = new Date(consulta.data_consulta).toISOString().split('T')[0];
      if (dataConsulta === today) {
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
          location.reload();
        },
        error: (error) => {
          console.error('Erro ao fazer upload:', error);
        }
      });
    
  }
}
