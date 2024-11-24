import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { AgendarComponent } from './agendar/agendar.component';
import { AuthGuard } from './guard/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Rota padrão
  { path: 'home', component: HomeComponent },
  { path: 'agendar', component: AgendarComponent, canActivate: [AuthGuard] }, // Protege a rota 'agendar'
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: '**', redirectTo: 'home' } // Fallback para rotas inválidas
];
