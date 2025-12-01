// src/app/core/services/entrega.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega.model'; // asegúrate de crear este modelo

@Injectable({
  providedIn: 'root',
})
export class EntregaService {
  private apiUrl = 'http://localhost:9090/api/v1/entregas'; // mismo puerto que incidencias

  constructor(private http: HttpClient) {}

  getEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.apiUrl);
  }

  getEntregaById(id: number): Observable<Entrega> {
    return this.http.get<Entrega>(`${this.apiUrl}/${id}`);
  }

  createEntrega(entrega: Entrega): Observable<Entrega> {
    return this.http.post<Entrega>(this.apiUrl, entrega);
  }

  updateEntrega(id: number, entrega: Entrega): Observable<Entrega> {
    return this.http.put<Entrega>(`${this.apiUrl}/${id}`, entrega);
  }

  deleteEntrega(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}