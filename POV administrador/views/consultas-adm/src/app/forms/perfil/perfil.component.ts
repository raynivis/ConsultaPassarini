import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { Clinica } from '../../../../../../../database/Models/Clinica';
import { ClinicaService } from '../../../../services/clinica.service';
import { Doutora } from '../../../../../../../database/Models/Doutora';
import { DoutoraService } from '../../../../services/doutora.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  // Define a referência ao input usando @ViewChild
  @ViewChild('InputForma') InputForma!: ElementRef<HTMLInputElement>;
  @ViewChild('InputEmail') InputEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('InputTelefone') InputTelefone!: ElementRef<HTMLInputElement>;
  @ViewChild('InputDesc') InputDesc!: ElementRef<HTMLInputElement>;
  @ViewChild('Botao') Botao!: ElementRef<HTMLInputElement>;
  @ViewChild('alt', { static: true }) alt!: ElementRef;
  @ViewChild('new', { static: true }) new!: ElementRef;


  clinicas: Clinica[] = [];
  doutora!: Doutora;
  formulario!: FormGroup;
  cidade: string = '';
  estado: string = '';
  nomeCli: string = '';
  endereco: string = '';
  email: string = '';
  telefone: string = '';
  informacoes: string = '';


  constructor(private clinicaService: ClinicaService, private doutoraService: DoutoraService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      formacoes: [''],// Iniciando como vazio
      email: [''],
      telefone: [''],
      descricao: ['']
    });
    this.clinicaService.getClinicas().subscribe(dado => { this.clinicas = dado; });
    this.doutoraService.getDoutora().subscribe(dado => {
      this.doutora = dado;
      this.formulario = this.fb.group({
        formacoes: [this.doutora.especializacoes],
        email: [this.doutora.email],
        telefone: [this.doutora.telefone],
        descricao: [this.doutora.descricao]
      });
      this.formulario.disable();
      this.Botao.nativeElement.disabled = true;
    });
  }
  // Método para ativar o input
  ativarInput() {
    this.formulario.enable();
    this.Botao.nativeElement.disabled = false;
  }

  salvarDoutora() {
    this.doutora.descricao = this.InputDesc.nativeElement.value;
    this.doutora.email = this.InputEmail.nativeElement.value;
    this.doutora.telefone = this.InputTelefone.nativeElement.value;
    this.doutora.especializacoes = this.InputForma.nativeElement.value;
    this.doutoraService.updateDoutora(this.doutora).subscribe();
    const toastElement = new (window as any).bootstrap.Toast(this.alt.nativeElement);
    toastElement.show();
    this.formulario.disable();
    this.Botao.nativeElement.disabled = true;
  }

  NovaClinica() {
    if (!this.cidade || !this.estado || !this.nomeCli || !this.endereco || !this.email || !this.telefone
      || !this.informacoes) {
      alert('Preencha todos os campos!!');
      return;
    }
    const nClinica = {
      id: (this.clinicas.length + 1).toString(),
      cidade: this.cidade,
      estado: this.estado,
      nome: this.nomeCli,
      endereco: this.endereco,
      email: this.email,
      telefone: this.telefone,
      infos_ad: this.informacoes,
      ativa: "sim"
    }
    this.clinicaService.addConsulta(nClinica).subscribe((nClinica) => {
      this.clinicas.push(nClinica);
    } );
    const toastElement = new (window as any).bootstrap.Toast(this.new.nativeElement);
    toastElement.show();
  }

}
