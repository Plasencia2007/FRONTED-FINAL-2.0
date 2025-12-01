// src/app/core/services/chofer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private apiUrl = 'http://localhost:9090/api/v1/choferes';

  constructor(private http: HttpClient) {}

  getChoferes(): Observable<{ id: number; nombres: string }[]> {
    return this.http.get<{ id: number; nombres: string }[]>(this.apiUrl);
  }
}