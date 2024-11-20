import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ConsultaService } from '../../../../../../POV administrador/views/consultas-adm/services/consulta.service';
import { Consulta } from '../../../../../../database/Models/Consulta';
import { PessoaService } from '../../../../../../POV administrador/views/consultas-adm/services/pessoa.service';
import { Pessoa } from '../../../../../../database/Models/Pessoa';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit {
  @ViewChild('ModalPaciente') modalElement!: ElementRef;
  consultas: Consulta[] = []; // lista de consultas
  pessoas: Pessoa[] = []; // lista de pessoas

  cpfLogado: string | null = null; // variável para armazenar o cpf da pessoa logada
  nomePaciente: string = 'ERRO'; // nome do paciente, inicia com 'ERRO'

  activeTab: string = 'agendar'; // Define a aba inicial como 'agendar'

  ativar(tab: string) {
    this.activeTab = tab; // Atualiza a aba ativa com base na seleção do usuário
  }

  constructor(
    private consultaService: ConsultaService,
    private pessoaService: PessoaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Recupera o CPF do usuário logado
    this.cpfLogado = this.authService.getLoggedInCpf();

    if (this.cpfLogado) {
      // Chama o método para obter as consultas do usuário logado
      this.consultaService.getConsultas().subscribe(consultas => {
        // Filtra as consultas pela pessoa logada (cpf)
        this.consultas = consultas.filter(consulta => consulta.cpf_paciente === this.cpfLogado);
      });

      // Chama o método para obter o nome do paciente com o CPF logado
      this.pessoaService.getNome(this.cpfLogado).subscribe(nome => {
        this.nomePaciente = nome; // Atribui o nome do paciente à variável
      });
    }
  }
}
