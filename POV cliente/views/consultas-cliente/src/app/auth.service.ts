import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/pessoas';
  private loggedInCpf: string | null = null;

  constructor(private http: HttpClient) { }

  login(cpf: string, senha: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/${cpf}`).pipe(
      map(user => {
        if (user && user.senha === senha) {
          this.loggedInCpf = cpf;  // Armazena o CPF do usuário logado
          return true;
        }
        return false;
      }),
      catchError(error => {
        return throwError(() => new Error('Erro de autenticação: Usuário não encontrado.'));
      })
    );
  }

  // Método para obter o CPF do usuário logado
  getLoggedInCpf(): string | null {
    console.log('CPF logado:', this.loggedInCpf);  // Adicione o log para depuração
    return this.loggedInCpf;
  }
  
  register(user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${user.cpf}`).pipe(
      switchMap(existingUser => {
        if (existingUser) {
          return throwError(() => new Error('CPF já cadastrado'));
        }
        return this.http.post<any>(this.apiUrl, user);
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erro ao cadastrar'));
      })
    );
  }
}
