import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ClinicaService } from '../../../services/clinica.service';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { ConsultaService } from '../../../services/consulta.service';
import { RouterModule } from '@angular/router';
import { Clinica } from '../../../../../../database/Models/Clinica';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.css'
})
export class VagasComponent implements OnInit {
  clinicas: Clinica[] = [];
  consultas: Consulta[] = [];
  //lista das consultas 

  constructor(private clinicaService: ClinicaService, private consultaService: ConsultaService) { } //back-end

  ngOnInit(): void { //colocando os dados do bd nas listas
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.consultaService.getConsultas().subscribe(dado => { this.consultas = dado; })
  }

  qtdConsultaMes(id: string): number { //calculo das consultas por clinica
    let qtd: number = 0;
    for (const consulta of this.consultas) {
      if (consulta.id_clinica == id) {
        qtd++;
      }
    }
    return qtd;
  }





}
