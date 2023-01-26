import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ Observable } from 'rxjs';
import { Persistence } from '../../modules/interfaces/model.persistence'

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  
  url: string = 'https://63cfffb8e52f587829a9baea.mockapi.io/aplications/persistence';

  

  constructor(private http:HttpClient) { }

  getPersistenceHealth(): Observable<Persistence> {

    let direccion = this.url

    return this.http.get<Persistence>(direccion)

  
}
  }

