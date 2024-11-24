import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/pessoas';

  constructor(private http: HttpClient) {}

  // Método de login
  login(cpf: string, senha: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/${cpf}`).pipe(
      map(user => {
        if (user && user.senha === senha) {
          // Armazena o CPF do usuário no sessionStorage
          sessionStorage.setItem('loggedInCpf', cpf);  // Armazena apenas o CPF no sessionStorage
          return true;
        }
        return false;
      }),
      catchError(error => {
        return throwError(() => new Error('Erro de autenticação: Usuário não encontrado.'));
      })
    );
  }

  // Método para registrar um usuário
  register(user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${user.cpf}`).pipe(
      switchMap(existingUser => {
        if (existingUser) {
          return throwError(() => new Error('CPF já cadastrado'));
        }
        return this.http.post<any>(this.apiUrl, user);  // Registra o novo usuário
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erro ao cadastrar'));
      })
    );
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return sessionStorage.getItem('loggedInCpf') !== null;  // Verifica se o CPF está armazenado
  }

  // Recupera o CPF do usuário logado
  getLoggedInCpf(): string | null {
    return sessionStorage.getItem('loggedInCpf');
  }

  // Faz logout, removendo o CPF do sessionStorage
  logout(): void {
    sessionStorage.removeItem('loggedInCpf');
  }
}
