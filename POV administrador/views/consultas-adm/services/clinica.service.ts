import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  addConsulta(clinica: Clinica) : Observable<Clinica>{
    return this.http.post<Clinica>(this.apiUrl, clinica);  
  }

}
