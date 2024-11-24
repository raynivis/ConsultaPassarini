import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SessionStorageService } from './session/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/pessoas';

  // Injetando o SessionStorageService no construtor
  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {}

  // Método de login
  login(cpf: string, senha: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/${cpf}`).pipe(
      map(user => {
        if (user && user.senha === senha) {
          sessionStorage.setItem('loggedInCpf', cpf); // Armazena apenas o CPF
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Erro no login:', error);
        return throwError(() => new Error('Usuário não encontrado ou erro no servidor.'));
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
    this.sessionStorageService.clearSessionStorage();  // Limpa todo o sessionStorage
  }
}
