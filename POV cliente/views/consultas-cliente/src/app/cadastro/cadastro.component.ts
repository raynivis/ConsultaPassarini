import { PessoaService } from './../../../../../../POV administrador/views/consultas-adm/services/pessoa.service';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Pessoa } from "../../../../../../database/Models/Pessoa"

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  providers: [AuthService]
})
export class CadastroComponent implements OnInit {
  user = {
    nome: '',
    sobrenome: '',
    cpf: '',
    cidade: '',
    telefone: '',
    senha: '',
    img: '',
    confirmaSenha: '', // Novo campo para confirmar a senha
    dataNasc: '',
    sexo: '',
    genero: '',
    orientacao_sexual: '',
    raca_cor: '',
    nome_mae: '',
    nome_pai: '',
    bairro: '',
    estado: '',
    logadouro: '',
    numero: 0
  };
  formSubmitted = false;
  fileUrl: string | null = null; //iniciando o file vazio
  selectedFile: File | null = null; // Armazena o arquivo selecionado
  private readonly pessoaSevice = inject(PessoaService);
  pessoas: Pessoa[] = [];
  pessoa!: Pessoa;
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.pessoaSevice.getPessoas().subscribe(dado => {
      this.pessoas = dado;
    })
  }

  onRegister() {
    this.formSubmitted = true;
    console.log(this.user);

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.user.bairro || !this.user.cidade || !this.user.confirmaSenha || !this.user.cpf || !this.user.dataNasc
      || !this.user.estado || !this.user.genero || !this.user.logadouro || !this.user.nome || !this.user.numero
      || !this.user.orientacao_sexual || !this.user.raca_cor || !this.user.senha || !this.user.sexo || !this.user.sobrenome
      || !this.user.telefone
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    for (const pessoa of this.pessoas) {
      if (pessoa.id == this.user.cpf) {
        alert('CPF já cadastrado!!');
        return;
      }
    }

    // Verifica se a senha e a confirmação da senha são iguais
    if (this.user.senha !== this.user.confirmaSenha) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }

    if (!this.selectedFile) {
      alert('Nenhum foto foi selecionada!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    this.http.post<{ filePath: string }>('http://localhost:3001/upload', formData)
      .subscribe({
        next: (response) => {
          this.fileUrl = `http://localhost:3001${response.filePath}`;
          this.user.img = this.fileUrl!;
          // Chama o serviço de cadastro
          this.pessoa = {
            id: this.user.cpf, // CPF
            senha: this.user.senha,
            nome: this.user.nome + ' ' + this.user.sobrenome,
            sexo: this.user.sexo,
            dataNasc: this.user.dataNasc, // "YYYY-MM-DDTHH:MM:SS" para datas ISO
            raca_cor: this.user.raca_cor,
            celular: this.user.telefone,
            nome_mae: this.user.nome_mae,
            nome_pai: this.user.nome_pai,
            genero: this.user.genero,
            orientacao_sexual: this.user.orientacao_sexual,
            logradouro: this.user.logadouro,
            numero: this.user.numero,
            bairro: this.user.bairro,
            cidade: this.user.cidade,
            estado: this.user.estado,
            img: this.user.img
          };
          this.authService.register(this.pessoa).subscribe(
            () => {
              alert('Cadastro realizado com sucesso!');
              this.router.navigate(['/login']);
            },
            (error) => {
              alert(error.message || 'Erro ao cadastrar');
            }
          );
        },
        error: (error) => {
          console.error('Erro ao fazer upload:', error);
        }
      });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input?.files?.[0] || null;
  }



}
