import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { PessoaService } from '../../../services/pessoa.service'
import { ClinicaService } from '../../../services/clinica.service';
import { ConsultaService } from '../../../services/consulta.service';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { Pessoa } from '../../../../../../database/Models/Pessoa';
import { Clinica } from '../../../../../../database/Models/Clinica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit{
  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = []; // Lista filtrada com base na pesquisa
  buscaNome: string = '';
  pacientes: Pessoa[] = [];
  clinicas: Clinica[] = [];

  constructor(private pessoaService: PessoaService, private clinicaService: ClinicaService,
    private consutaService: ConsultaService) { }

  ngOnInit(): void {
    this.pessoaService.getPessoas().subscribe(dado => { this.pacientes = dado; });
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado; });
    this.filtrarConsultas();
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
    this.consultasFiltradas = this.consultas.filter((consulta) =>
      this.buscarPaciente(consulta.cpf_paciente)?.nome
        .toLowerCase()
        .includes(this.buscaNome.toLowerCase())
    );
  }
}
