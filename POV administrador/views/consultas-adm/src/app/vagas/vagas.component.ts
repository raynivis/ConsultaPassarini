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
    this.clinicaService.getClinicas().subscribe(dado => {
      this.clinicas = dado;
      this.clinicas = this.clinicas.sort((a, b) => {
        if (a.ativa === "sim" && b.ativa === "não") {
          return -1; // "sim" vem antes de "não"
        } else if (a.ativa === "não" && b.ativa === "sim") {
          return 1; // "não" vem depois de "sim"
        }
        return 0; // Mantém a ordem original se ambos forem iguais
      });
    });
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

  desativarClinica(clinica: Clinica){
    clinica.ativa = "não";
    var resposta = confirm('Deseja mesmo desativar a clinica?');
    if(resposta){
      this.clinicaService.updateClinica(clinica).subscribe();
    }
    window.location.reload();
  }

  ativarClinica(clinica: Clinica){
    clinica.ativa = "sim";
    var resposta = confirm('Deseja mesmo reativar a clinica?');
    if(resposta){
      this.clinicaService.updateClinica(clinica).subscribe();
    }
    window.location.reload();
  }





}
