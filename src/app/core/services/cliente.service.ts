// src/app/core/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:9090/api/v1/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<{ id: number; razonSocial: string }[]> {
    return this.http.get<{ id: number; razonSocial: string }[]>(this.apiUrl);
  }
}