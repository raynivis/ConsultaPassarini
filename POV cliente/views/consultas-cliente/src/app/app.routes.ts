import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { AgendarComponent } from './agendar/agendar.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'agendar', component: AgendarComponent},
    {path: 'login', component: LoginComponent},
    {path: 'cadastro', component: CadastroComponent},
];
