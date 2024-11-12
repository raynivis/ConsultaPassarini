import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute } from '@angular/router';
import { Consulta } from '../../../../../../../database/Models/Consulta';
import { ConsultaService } from '../../../../services/consulta.service';


@Component({
  selector: 'app-cadastro-vg',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './cadastro-vg.component.html',
  styleUrl: './cadastro-vg.component.css'
})
export class CadastroVgComponent implements OnInit{
  // refs para os inputs no html
  @ViewChild('tipo') tipo!: ElementRef<HTMLInputElement>;
  @ViewChild('preco') preco!: ElementRef<HTMLInputElement>;
  @ViewChild('data') data!: ElementRef<HTMLInputElement>;
  @ViewChild('new', { static: true }) new!: ElementRef;// refs para a notificacao de cadastro
  id!: number; //id da Clinica 
  consultas: Consulta[] = []; //lista de consultas

  //chamando o back-end da consulta e routas para receber o GET da pagina
  constructor(private route: ActivatedRoute, private consutaService: ConsultaService) { } 

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']; //recebendo no id o get passado por parametro 
      this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado; }); //receber a lista de consultas
    });
  }

  //metodo de receber a nova consulta
  adicionarConsulta(){
    //recebendo valores
    const tipoConsulta = this.tipo.nativeElement.value;
    const precoConsulta = this.preco.nativeElement.value;
    const dataConsulta = this.data.nativeElement.value;

    //vendo se os campos estao vazios
    if (!tipoConsulta || !precoConsulta || !dataConsulta) {
      alert('Preencha todos os campos!!');
      return;
    }

    //criando a nova consulta
    const novaConsulta = {
      id: (this.consultas.length+1).toString(),
      tipo_consulta: tipoConsulta,
      preco:  Number(precoConsulta),
      data_consulta: dataConsulta,
      cpf_paciente: '',
      id_clinica: (this.id).toString(),
      relatorio: ''
    }

    //cadastrando do BD
    this.consutaService.addConsulta(novaConsulta).subscribe((novaConsulta) => {
      this.consultas.push(novaConsulta);
    });

    //mostrar a notificacao de sucesso
    const toastElement = new (window as any).bootstrap.Toast(this.new.nativeElement);
    toastElement.show();

  }
}
