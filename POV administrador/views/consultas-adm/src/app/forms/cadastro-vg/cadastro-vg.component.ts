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
  @ViewChild('tipo') tipo!: ElementRef<HTMLInputElement>;
  @ViewChild('preco') preco!: ElementRef<HTMLInputElement>;
  @ViewChild('data') data!: ElementRef<HTMLInputElement>;
  @ViewChild('new', { static: true }) new!: ElementRef;
  id!: number;
  consultas: Consulta[] = [];

  constructor(private route: ActivatedRoute, private consutaService: ConsultaService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];   
      this.consutaService.getConsultas().subscribe(dado => { this.consultas = dado; });
    });
  }

  adicionarConsulta(){
    const tipoConsulta = this.tipo.nativeElement.value;
    const precoConsulta = this.preco.nativeElement.value;
    const dataConsulta = this.data.nativeElement.value;

    if (!tipoConsulta || !precoConsulta || !dataConsulta) {
      alert('Preencha todos os campos!!');
      return;
    }

    const novaConsulta = {
      id : this.consultas.length+1,
      tipo_consulta: tipoConsulta,
      preco:  Number(precoConsulta),
      data_consulta: dataConsulta,
      cpf_paciente: '',
      id_clinica: this.id,
    }

    this.consutaService.addConsulta(novaConsulta).subscribe((novaConsulta) => {
      this.consultas.push(novaConsulta);
    });

    const toastElement = new (window as any).bootstrap.Toast(this.new.nativeElement);
    toastElement.show();

  }
}
