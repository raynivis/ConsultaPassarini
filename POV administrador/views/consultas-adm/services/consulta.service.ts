import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consulta } from '../../../../database/Models/Consulta'

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'http://localhost:3000/consultas';

  constructor(private http : HttpClient) { }

  getConsultas () : Observable<Consulta[]>{
    return this.http.get<Consulta[]>(this.apiUrl);
  }

  addConsulta(consulta: Consulta) : Observable<Consulta>{
    return this.http.post<Consulta>(this.apiUrl, consulta);  
  }
}
