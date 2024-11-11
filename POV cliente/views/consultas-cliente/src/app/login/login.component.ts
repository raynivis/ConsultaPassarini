import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule], // Importar o HttpClientModule aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService] // Adicione o AuthService como provider, caso ainda não esteja
})
export class LoginComponent {
  cpf = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log('Tentando logar com CPF:', this.cpf);  // Adicione um log
    this.authService.login(this.cpf, this.senha).subscribe(success => {
      if (success) {
        alert('Login bem-sucedido!');
        this.router.navigate(['/home']);
      } else {
        alert('CPF ou senha incorretos');
      }
    });
  }  
}
