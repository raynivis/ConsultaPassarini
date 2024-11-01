import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { VagasComponent } from './vagas/vagas.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './forms/perfil/perfil.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'pacientes', component: PacientesComponent},
    {path: 'vagas', component: VagasComponent},
    {path: 'login', component: LoginComponent},
    {path: 'perfil', component: PerfilComponent}
];

