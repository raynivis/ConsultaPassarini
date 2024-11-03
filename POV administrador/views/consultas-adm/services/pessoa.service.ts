import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../../../../database/Models/Pessoa'

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private apiUrl = 'http://localhost:3000/pessoas';

  constructor(private http : HttpClient) { }

  getPessoas () : Observable<Pessoa[]>{
    return this.http.get<Pessoa[]>(this.apiUrl);
  }
}
