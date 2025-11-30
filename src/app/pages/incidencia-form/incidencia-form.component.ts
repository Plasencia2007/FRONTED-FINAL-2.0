// src/app/features/incidencia-form/incidencia-form.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { Incidencia } from '../../core/models/incidencia.model';
import { NgIf, NgFor, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-incidencia-form',
  templateUrl: './incidencia-form.component.html',
  styleUrls: ['./incidencia-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    FormsModule,
    DatePipe,
    NgClass
  ]
})
export class IncidenciaFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidenciaService = inject(IncidenciaService);

  incidenciaId: number | null = null;
  isEdit = false;

  mostrarNotificacion = false;
  mensajeNotificacion = '';
  tipoNotificacion: 'success' | 'error' = 'success';

  tiposIncidencia = [
    'Neumático pinchado',
    'Problema mecánico',
    'Accidente menor',
    'Falla eléctrica',
    'Pérdida de carga',
    'Retraso en ruta',
    'Otros'
  ];

  prioridades = ['ALTA', 'MEDIA', 'BAJA'];

  form = this.fb.group({
    tipoIncidencia: ['', [Validators.required]],
    prioridad: ['', [Validators.required]],
    detalles: [''],
    evidencia: ['']
  });

  previewUrl = '';
  fileObject: File | null = null;
  existingEvidenceUrl: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.incidenciaId = +id;
      this.isEdit = true;
      this.loadIncidencia();
    }
  }

  loadIncidencia(): void {
    if (this.incidenciaId) {
      this.incidenciaService.getIncidenciaById(this.incidenciaId).subscribe({
        next: (data) => {
          this.existingEvidenceUrl = data.evidencia || null;
          this.form.patchValue({
            tipoIncidencia: data.tipoIncidencia,
            prioridad: data.prioridad,
            detalles: data.detalles || '',
            evidencia: data.evidencia || ''
          });
          if (data.evidencia && !data.evidencia.startsWith('blob:')) {
            this.previewUrl = data.evidencia;
          }
        },
        error: () => {
          this.mostrarNotificacionTemporal('No se pudo cargar la incidencia.', 'error');
          setTimeout(() => this.router.navigate(['/incidencias']), 2000);
        }
      });
    }
  }

  getPrioridadDisplay(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }

  mostrarNotificacionTemporal(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.mensajeNotificacion = mensaje;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => {
      this.mostrarNotificacion = false;
    }, 5000);
  }

  get now(): Date {
    return new Date();
  }

  private uploadFileIfPresent(): Observable<string> {
    if (this.fileObject) {
      return this.incidenciaService.uploadFile(this.fileObject);
    } else if (this.isEdit && this.existingEvidenceUrl) {
      return of(this.existingEvidenceUrl);
    } else {
      return of('');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.form.patchValue({ evidencia: '' });

    this.uploadFileIfPresent().pipe(
      switchMap(evidenciaUrl => {
        const incidenciaBase = {
          tipoIncidencia: this.form.value.tipoIncidencia!,
          prioridad: this.form.value.prioridad!,
          detalles: this.form.value.detalles || '',
          evidencia: evidenciaUrl
        };

        const incidencia: Incidencia = this.isEdit && this.incidenciaId
          ? { ...incidenciaBase, id: this.incidenciaId }
          : incidenciaBase;

        return this.isEdit && this.incidenciaId
          ? this.incidenciaService.updateIncidencia(this.incidenciaId, incidencia)
          : this.incidenciaService.createIncidencia(incidencia);
      }),
      catchError(() => {
        this.mostrarNotificacionTemporal('Error al procesar la incidencia.', 'error');
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.mostrarNotificacionTemporal(
            this.isEdit ? 'Incidencia actualizada' : 'Incidencia registrada',
            'success'
          );
          setTimeout(() => this.router.navigate(['/incidencias']), 1500);
        }
      },
      error: () => {
        this.mostrarNotificacionTemporal('Error al guardar la incidencia.', 'error');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/incidencias']);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileObject = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  ngOnDestroy(): void {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}