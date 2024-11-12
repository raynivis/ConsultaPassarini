import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DoutoraService } from '../../../services/doutora.service';
import { Doutora } from '../../../../../../database/Models/Doutora';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild('user') user!: ElementRef<HTMLInputElement>; //ref para os inputs
  @ViewChild('pass') pass!: ElementRef<HTMLInputElement>;
  @ViewChild('erro', { static: true }) erro!: ElementRef; //ref para notificacao de erro

  doutora!: Doutora; //Variavel para a Doutora

  constructor(private doutoraService: DoutoraService, private router: Router) { //chamando o back-end da doutora e das rotas
  }

  ngOnInit() { //colocando a doutora da variavel antes de iniciar a pag
    this.doutoraService.getDoutora().subscribe(dado => { this.doutora = dado });
  }

  verificarLogin() { //verificação do Login
    if (this.doutora.id === this.user.nativeElement.value && this.doutora.senha === this.pass.nativeElement.value) {
      this.router.navigate(['/home']);
      return;
    }
    const toastElement = new (window as any).bootstrap.Toast(this.erro.nativeElement);
    toastElement.show();
  }

}
