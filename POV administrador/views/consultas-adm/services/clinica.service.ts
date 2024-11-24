import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Clinica } from '../../../../database/Models/Clinica'

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  private apiUrl = 'http://localhost:3000/clinicas';

  constructor(private http : HttpClient) { }

  getClinicas () : Observable<Clinica[]>{
    return this.http.get<Clinica[]>(this.apiUrl);
  }

  getClinicaNomeById(id: number): Observable<string> {
    return this.http.get<Clinica>(`${this.apiUrl}/${id}`).pipe(
      map(clinica => clinica.nome)  // Retorna o nome da clínica
    );
  }

  addConsulta(clinica: Clinica) : Observable<Clinica>{
    return this.http.post<Clinica>(this.apiUrl, clinica);  
  }

}
