import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../../../../database/Models/Pessoa'
import { map } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private apiUrl = 'http://localhost:3000/pessoas';

  constructor(private http : HttpClient) { }

  getPessoas () : Observable<Pessoa[]>{
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  updatePessoa(pessoa: any) : Observable<Pessoa>{
    return this.http.put<Pessoa>(`${this.apiUrl}/${pessoa.id}`, pessoa);
  }

  // Método para obter o nome do paciente pelo CPF
  getNome(cpf: string): Observable<string> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${cpf}`).pipe(
      map(pessoa => {
        console.log('Pessoa encontrada:', pessoa); // Verifique se o nome está correto
        return pessoa ? pessoa.nome : 'Paciente não encontrado';
      }),
      catchError(error => {
        console.error('Erro ao buscar nome:', error);
        return throwError(() => new Error('Erro ao buscar o nome.'));
      })
    );
  }
}
