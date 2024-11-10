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


@Component({
  selector: 'app-edita-vg',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './edita-vg.component.html',
  styleUrl: './edita-vg.component.css'
})
export class EditaVgComponent implements OnInit{
  id!: number;
  consultas: Consulta[] = [];
  pacientes: Pessoa[] = [];
  clinicas: Clinica[] = [];
  consultasId: Consulta[] = [];
  consultasFiltradas: Consulta[] = []; // Lista filtrada com base na pesquisa
  data: string = '';
  
  constructor(private route: ActivatedRoute, private consutaService: ConsultaService, private pessoaService: PessoaService, private clinicaService: ClinicaService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
      this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; }); 
      this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado; this.clinicasConsultas(); });
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

  buscarClinica(idclinica: number): Clinica | null {
    for (const clinica of this.clinicas) {
      if (idclinica == clinica.id) {
        return clinica;
      }
    }
    return null;
  }

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
}
