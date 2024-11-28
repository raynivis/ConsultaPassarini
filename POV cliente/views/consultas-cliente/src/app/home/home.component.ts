import { DoutoraService } from './../../../../../../POV administrador/views/consultas-adm/services/doutora.service';
import { Doutora } from './../../../../../../database/Models/Doutora';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ClinicaService } from '../../../../../../POV administrador/views/consultas-adm/services/clinica.service';
import { Clinica } from '../../../../../../database/Models/Clinica';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Corrigido o nome de 'styleUrl' para 'styleUrls'
})
export class HomeComponent implements OnInit {
  @ViewChild('ModalPaciente') modalElement!: ElementRef;
  clinicas: Clinica[] = []; // lista de clinicas
  doutora!: Doutora;

  activeTab: string = 'home'; // Define a aba inicial como 'home'

  ativar(tab: string) {
    this.activeTab = tab; // Atualiza a aba ativa com base na seleção do usuário
  }

  constructor(private clinicaService: ClinicaService, private doutoraService: DoutoraService) { }

  ngOnInit(): void {
    this.clinicaService.getClinicas().subscribe(dado => {
      this.clinicas = dado;
    });
    this.doutoraService.getDoutora().subscribe( dado => {
      this.doutora = dado;
    });
  }
}
