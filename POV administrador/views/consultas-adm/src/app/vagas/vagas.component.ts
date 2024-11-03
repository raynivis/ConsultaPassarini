import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ClinicaService } from '../../../services/clinica.service';
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
export class VagasComponent implements OnInit{
  clinicas: Clinica[] = [];

  constructor(private clinicaService: ClinicaService) { }

  ngOnInit(): void {
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
  }


}
