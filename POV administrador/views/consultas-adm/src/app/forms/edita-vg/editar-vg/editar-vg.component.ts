import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../header/header.component";
import { Consulta } from '../../../../../../../../database/Models/Consulta';
import { ConsultaService } from '../../../../../services/consulta.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';



@Component({
  selector: 'app-editar-vg',
  standalone: true,
  imports: [HeaderComponent, RouterModule, CommonModule],
  templateUrl: './editar-vg.component.html',
  styleUrl: './editar-vg.component.css'
})
export class EditarVgComponent implements OnInit{

  id!: string;
  formulario!: FormGroup;
  consultas: Consulta[] = [];
  consulta!: Consulta;
  @ViewChild('tipo') tipo!: ElementRef<HTMLInputElement>;
  @ViewChild('preco') preco!: ElementRef<HTMLInputElement>;
  @ViewChild('data') data!: ElementRef<HTMLInputElement>;
  @ViewChild('apagar') apagar!: ElementRef<HTMLInputElement>;
  @ViewChild('new', { static: true }) new!: ElementRef;

  
  constructor(private route: ActivatedRoute, private consultaService: ConsultaService, private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.consultaService.getConsultas().subscribe( dado => {
        this.consultas = dado;
        this.consulta = this.buscarConsulta(this.id)!;
        this.tipo.nativeElement.value = this.consulta.tipo_consulta;      
        this.data.nativeElement.value = this.consulta.data_consulta;
        this.preco.nativeElement.value = this.consulta.preco.toString();
      });
    });
  }

  buscarConsulta(id: string): Consulta | null {
    for (const consulta of this.consultas) {
      if (id == consulta.id) {
        return consulta;
      }
    }
    return null;
  }

  salvarConsulta(){
    const novaConsulta = {
      id : this.consulta.id,
      tipo_consulta: this.tipo.nativeElement.value,
      preco:  Number(this.preco.nativeElement.value),
      data_consulta: this.data.nativeElement.value,
      cpf_paciente: '',
      id_clinica: this.consulta.id_clinica,
    }
    if(this.apagar.nativeElement.value == 'nao'){
      novaConsulta.cpf_paciente = this.consulta.cpf_paciente;
    }
    this.consultaService.updateConsulta(novaConsulta).subscribe();
    const toastElement = new (window as any).bootstrap.Toast(this.new.nativeElement);
    toastElement.show();
  }

  apagarConsulta(){
    this.consultaService.deleteConsulta(this.consulta).subscribe(() => {
      alert('Excluído Consulta com Sucesso, Você será redirecionado!');
      this.location.back(); // Volta para a página anterior
    });
  }

}
