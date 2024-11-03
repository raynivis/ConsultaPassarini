import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doutora } from '../../../../database/Models/Doutora'


@Injectable({
  providedIn: 'root'
})
export class DoutoraService {

  private apiUrl = 'http://localhost:3000/doutora';

  constructor(private http : HttpClient) { }

  getDoutoras () : Observable<Doutora[]>{
    return this.http.get<Doutora[]>(this.apiUrl);
  }
}
