import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  activeTab: string = 'home'; // Define a aba inicial como 'home'

  ativar(tab: string) {
    this.activeTab = tab; // Atualiza a aba ativa com base na seleção do usuário
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule],
})
export class AppModule {}
