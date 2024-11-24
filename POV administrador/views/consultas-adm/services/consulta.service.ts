import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getConsultaPorCpf(cpf: string): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}?cpf=${cpf}`);
  }

  // Método para buscar consultas com cpf_paciente vazio ou nulo
  getConsultasSemCpf(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.apiUrl).pipe(
      map(consultas => {
        // Agora consultas é um array e podemos aplicar o filtro diretamente
        return consultas.filter(consulta => !consulta.cpf_paciente || consulta.cpf_paciente.trim() === '');
      })
    );
  }

   // Método para agendar consulta
   agendarConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/${consulta.id}`, consulta); // Supondo que a consulta tenha um id
  }

   // Método para remover o CPF de uma consulta/ desmarcar uma consulta
   removerCpfConsulta(consultaId: string): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/remover-cpf/${consultaId}`, {}); // Envia a requisição PUT
  }

  addConsulta(consulta: Consulta) : Observable<Consulta>{
    return this.http.post<Consulta>(this.apiUrl, consulta);  
  }
  deleteConsulta(consulta: Consulta) : Observable<Consulta>{
    return this.http.delete<Consulta>(`${this.apiUrl}/${consulta.id}`);
  }

  updateConsulta(consulta: Consulta) : Observable<Consulta>{
    return this.http.put<Consulta>(`${this.apiUrl}/${consulta.id}`, consulta);
  }
}
