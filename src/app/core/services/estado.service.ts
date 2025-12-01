// src/app/core/services/estado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private apiUrl = 'http://localhost:9090/api/v1/estados';

  constructor(private http: HttpClient) {}

  getEstados(): Observable<{ id: number; descripcion: string }[]> {
    return this.http.get<{ id: number; descripcion: string }[]>(this.apiUrl);
  }
}