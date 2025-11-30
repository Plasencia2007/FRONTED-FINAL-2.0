// src/app/core/services/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:9090/api/v1/auth';

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(resp => {
        const token = resp.token;
        localStorage.setItem('token', token);

        const decoded: any = jwtDecode(token);
        const username = decoded.username || decoded.sub;
        localStorage.setItem('username', username);

        // ✅ Guarda las operaciones (permisos)
        if (decoded.operations) {
          localStorage.setItem('operations', JSON.stringify(decoded.operations));
        }

        const role = decoded.rol || decoded.role;
        localStorage.setItem('role', role);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('operations'); // ✅ Elimina operaciones
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // ✅ Obtener operaciones (permisos)
  getOperations(): string[] {
    const ops = localStorage.getItem('operations');
    return ops ? JSON.parse(ops) : [];
  }

  // ✅ Verificar si tiene un permiso específico
  tienePermiso(operacion: string): boolean {
    const operations = this.getOperations();
    
    // ✅ Si tiene "INCIDENCIAS", tiene todos los permisos de incidencias
    if (operations.includes('INCIDENCIAS')) {
      return true;
    }

    // ✅ De lo contrario, verifica el permiso exacto
    return operations.includes(operacion);
  }

  // ✅ Permisos específicos
  puedeVerIncidencias(): boolean {
    return this.tienePermiso('GET_ALL_INCIDENCIAS') || this.tienePermiso('GET_ONE_INCIDENCIA');
  }

  puedeCrearIncidencias(): boolean {
    return this.tienePermiso('CREATE_INCIDENCIAS');
  }

  puedeEditarIncidencias(): boolean {
    return this.tienePermiso('UPDATE_INCIDENCIAS');
  }

  puedeEliminarIncidencias(): boolean {
    return this.tienePermiso('DELETE_INCIDENCIAS');
  }

  // ✅ Para saber si es admin/chofer (opcional)
  esChoferOAdmin(): boolean {
    const role = this.getRole();
    return role === 'CHOFER' || role === 'ADMIN';
  }
}