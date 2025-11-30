// src/app/features/incidencia/incidencia.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { Incidencia } from '../../core/models/incidencia.model';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-incidencia',
    templateUrl: './incidencia.component.html',
    styleUrls: ['./incidencia.component.css'],
    imports: [NgFor, NgIf, RouterLink, FormsModule, NgClass]
})
export class IncidenciaComponent implements OnInit {
    incidencias: Incidencia[] = [];
    private todasIncidencias: Incidencia[] = [];
    private _filtroPrioridad: string = '';

    mostrarModalDetalles = false;
    incidenciaSeleccionada: Incidencia | null = null;

    private incidenciaService = inject(IncidenciaService);
    private authService = inject(AuthService);

    puedeCrear = false;
    puedeEditar = false;
    puedeEliminar = false;

    ngOnInit(): void {
        this.cargarIncidencias();
        this.puedeCrear = this.authService.puedeCrearIncidencias();
        this.puedeEditar = this.authService.puedeEditarIncidencias();
        this.puedeEliminar = this.authService.puedeEliminarIncidencias();
    }

    private cargarIncidencias(): void {
        this.incidenciaService.getIncidencias().subscribe(data => {
            this.todasIncidencias = data;
            this.incidencias = data;
        });
    }

    get filtroPrioridad(): string {
        return this._filtroPrioridad;
    }

    set filtroPrioridad(value: string) {
        this._filtroPrioridad = value;
        this.filtrarIncidencias();
    }

    private filtrarIncidencias(): void {
        if (!this.filtroPrioridad) {
            this.incidencias = this.todasIncidencias;
        } else {
            this.incidencias = this.todasIncidencias.filter(
                inc => inc.prioridad === this.filtroPrioridad
            );
        }
    }

    eliminarIncidencia(id: number | undefined): void {
        if (id == null) return;
        if (!this.puedeEliminar) {
            alert('🔒 No tienes permisos para eliminar incidencias.');
            return;
        }
        if (confirm('¿Estás seguro?')) {
            this.incidenciaService.deleteIncidencia(id).subscribe({
                next: () => this.cargarIncidencias(),
                error: () => alert('No se pudo eliminar la incidencia.')
            });
        }
    }

    abrirModalDetalles(incidencia: Incidencia): void {
        this.incidenciaSeleccionada = incidencia;
        this.mostrarModalDetalles = true;
    }

    cerrarModal(): void {
        this.mostrarModalDetalles = false;
        this.incidenciaSeleccionada = null;
    }

    getPrioridadClass(prioridad: string | undefined): string {
        if (!prioridad) return 'bg-secondary';
        switch (prioridad) {
            case 'BAJA': return 'bg-success';
            case 'MEDIA': return 'bg-warning text-dark';
            case 'ALTA': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    esUrlTemporal(url: string): boolean {
        return url.startsWith('blob:http');
    }

    isImage(url: string): boolean {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    openFile(url: string | undefined): void {
        if (!url) return;
        window.open(url, '_blank');
    }

    get isEvidenciaValida(): boolean {
        return !!this.incidenciaSeleccionada?.evidencia && !this.esUrlTemporal(this.incidenciaSeleccionada.evidencia);
    }

    get isEvidenciaImagen(): boolean {
        return this.isEvidenciaValida && this.isImage(this.incidenciaSeleccionada!.evidencia);
    }

    get isEvidenciaNoImagen(): boolean {
        return this.isEvidenciaValida && !this.isImage(this.incidenciaSeleccionada!.evidencia);
    }
}