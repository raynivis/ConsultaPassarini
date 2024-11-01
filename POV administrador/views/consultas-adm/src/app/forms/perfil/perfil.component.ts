import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  // Define a referência ao input usando @ViewChild
  @ViewChild('InputForma') InputForma!: ElementRef<HTMLInputElement>;
  @ViewChild('InputEmail') InputEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('InputTelefone') InputTelefone!: ElementRef<HTMLInputElement>;
  @ViewChild('InputDesc') InputDesc!: ElementRef<HTMLInputElement>;
  @ViewChild('Botao') Botao!: ElementRef<HTMLInputElement>;


  // Método para ativar o input
  ativarInput() {
    this.InputForma.nativeElement.disabled = false;
    this.InputEmail.nativeElement.disabled = false;
    this.InputTelefone.nativeElement.disabled = false;
    this.InputDesc.nativeElement.disabled = false;
    this.Botao.nativeElement.disabled = false;
  }
}
