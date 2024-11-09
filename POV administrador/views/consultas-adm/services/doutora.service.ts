import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Doutora } from '../../../../database/Models/Doutora'


@Injectable({
  providedIn: 'root'
})
export class DoutoraService {

  private apiUrl = 'http://localhost:3000/doutora/admin';

  constructor(private http: HttpClient) { }

  getDoutora(): Observable<Doutora> {
    return this.http.get<Doutora>(this.apiUrl);
  }

  updateDoutora(doutora: Doutora): Observable<Doutora> {
    return this.http.put<Doutora>(this.apiUrl, doutora);
  }



}
